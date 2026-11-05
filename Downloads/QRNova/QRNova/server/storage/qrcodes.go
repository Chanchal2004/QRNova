
package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type QRCode struct {
	ID               string
	UserID           string
	Name             string
	Kind             string
	QRType           string
	Content          string
	Destination      *string
	Slug             *string
	FileID           *string
	File             *File
	Status           string
	DisabledReason   *string
	AdminLocked      bool
	OwnerDisabled    bool
	ExpiresAt        *int64
	PasswordHash     *string
	UTM              *string
	AnalyticsEnabled bool
	CampaignID       *string
	DomainID         *string
	DomainHost       *string
	DomainVerified   bool
	Design           *string
	FormData         *string
	ScanCount        int64
	CreatedAt        int64
	UpdatedAt        int64
	OwnerEmail       string
}

type QRFilter struct {
	UserID     string
	CampaignID string
	Status     string
	Kind       string
	Query      string
	Sort       string
	Limit      int
	Offset     int
}

func ValidQRSort(sort string) bool {
	switch sort {
	case "created_at", "-created_at", "name", "-name",
		"scan_count", "-scan_count":
		return true
	}
	return false
}

const qrSelect = `
SELECT
	q.id, q.user_id, q.name, q.kind, q.qr_type, q.content,
	q.destination, q.slug, q.file_id, q.status, q.disabled_reason,
	q.admin_locked, q.owner_disabled, q.expires_at, q.password_hash,
	q.utm, q.analytics_enabled, q.campaign_id, q.domain_id,
	d.hostname, COALESCE(d.verified, FALSE),
	q.design, q.form_data, q.scan_count, q.created_at, q.updated_at,
	u.email
FROM qrcodes q
JOIN users u ON u.id = q.user_id
LEFT JOIN domains d ON d.id = q.domain_id
`

func scanQRCode(row interface{ Scan(...any) error }) (*QRCode, error) {
	q := &QRCode{}
	err := row.Scan(
		&q.ID, &q.UserID, &q.Name, &q.Kind, &q.QRType, &q.Content,
		&q.Destination, &q.Slug, &q.FileID, &q.Status, &q.DisabledReason,
		&q.AdminLocked, &q.OwnerDisabled, &q.ExpiresAt, &q.PasswordHash,
		&q.UTM, &q.AnalyticsEnabled, &q.CampaignID, &q.DomainID,
		&q.DomainHost, &q.DomainVerified,
		&q.Design, &q.FormData, &q.ScanCount, &q.CreatedAt, &q.UpdatedAt,
		&q.OwnerEmail,
	)
	if err != nil {
		return nil, mapErr(err)
	}
	return q, nil
}

func (db *DB) loadQRFile(ctx context.Context, q *QRCode) {
	if q.FileID == nil {
		return
	}
	file, err := db.GetFile(ctx, *q.FileID, q.UserID)
	if err == nil {
		q.File = file
	}
}

func (db *DB) GetQRCode(ctx context.Context, id, userID string) (*QRCode, error) {
	query := qrSelect + `
	WHERE q.id = ? AND (? = '' OR q.user_id = ?)
	LIMIT 1`

	q, err := scanQRCode(db.QueryRow(ctx, query, id, userID, userID))
	if err != nil {
		return nil, err
	}
	db.loadQRFile(ctx, q)
	return q, nil
}

func (db *DB) GetQRCodeBySlug(ctx context.Context, slug string) (*QRCode, error) {
	q, err := scanQRCode(db.QueryRow(ctx,
		qrSelect+` WHERE q.slug = ? LIMIT 1`, slug))
	if err != nil {
		return nil, err
	}
	db.loadQRFile(ctx, q)
	return q, nil
}

func (db *DB) CreateQRCode(ctx context.Context, q *QRCode) error {
	now := Now()
	if q.ID == "" {
		q.ID = NewID("qr")
	}
	if q.Status == "" {
		q.Status = "active"
	}
	if q.QRType == "" {
		q.QRType = "url"
	}
	if q.Kind == "" {
		q.Kind = "dynamic"
	}
	q.CreatedAt = now
	q.UpdatedAt = now

	_, err := db.Exec(ctx, `
		INSERT INTO qrcodes (
			id, user_id, name, kind, qr_type, content,
			destination, slug, file_id, status, disabled_reason,
			admin_locked, owner_disabled, expires_at, password_hash,
			utm, analytics_enabled, campaign_id, domain_id,
			design, form_data, scan_count, created_at, updated_at
		) VALUES (
			?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
			?, ?, ?, ?, ?, ?, ?, ?, ?
		)`,
		q.ID, q.UserID, q.Name, q.Kind, q.QRType, q.Content,
		q.Destination, q.Slug, q.FileID, q.Status, q.DisabledReason,
		q.AdminLocked, q.OwnerDisabled, q.ExpiresAt, q.PasswordHash,
		q.UTM, q.AnalyticsEnabled, q.CampaignID, q.DomainID,
		q.Design, q.FormData, q.ScanCount, q.CreatedAt, q.UpdatedAt,
	)
	return mapErr(err)
}

func (db *DB) UpdateQRCode(ctx context.Context, q *QRCode) error {
	q.UpdatedAt = Now()

	result, err := db.Exec(ctx, `
		UPDATE qrcodes SET
			name = ?, kind = ?, qr_type = ?, content = ?,
			destination = ?, slug = ?, file_id = ?, status = ?,
			disabled_reason = ?, admin_locked = ?, owner_disabled = ?,
			expires_at = ?, password_hash = ?, utm = ?,
			analytics_enabled = ?, campaign_id = ?, domain_id = ?,
			design = ?, form_data = ?, updated_at = ?
		WHERE id = ?`,
		q.Name, q.Kind, q.QRType, q.Content,
		q.Destination, q.Slug, q.FileID, q.Status,
		q.DisabledReason, q.AdminLocked, q.OwnerDisabled,
		q.ExpiresAt, q.PasswordHash, q.UTM,
		q.AnalyticsEnabled, q.CampaignID, q.DomainID,
		q.Design, q.FormData, q.UpdatedAt, q.ID,
	)
	if err != nil {
		return mapErr(err)
	}
	n, err := result.RowsAffected()
	if err == nil && n == 0 {
		return ErrNotFound
	}
	return nil
}

func (db *DB) DeleteQRCode(ctx context.Context, id, userID string) error {
	result, err := db.Exec(ctx, `
		DELETE FROM qrcodes
		WHERE id = ? AND user_id = ?`, id, userID)
	if err != nil {
		return err
	}
	n, err := result.RowsAffected()
	if err == nil && n == 0 {
		return ErrNotFound
	}
	return err
}

func (db *DB) SlugExists(ctx context.Context, slug, excludeID string) (bool, error) {
	var count int64
	err := db.QueryRow(ctx, `
		SELECT COUNT(*) FROM qrcodes
		WHERE slug = ? AND id <> ?`, slug, excludeID).Scan(&count)
	return count > 0, err
}

func (db *DB) CountQRCodes(ctx context.Context, userID string) (int64, error) {
	if userID == "" {
		return db.Count(ctx, `SELECT COUNT(*) FROM qrcodes`)
	}
	return db.Count(ctx,
		`SELECT COUNT(*) FROM qrcodes WHERE user_id = ?`, userID)
}

func (db *DB) ListQRCodes(ctx context.Context, f QRFilter) ([]*QRCode, int64, error) {
	where := []string{"1 = 1"}
	args := []any{}

	if f.UserID != "" {
		where = append(where, "q.user_id = ?")
		args = append(args, f.UserID)
	}
	if f.CampaignID != "" {
		where = append(where, "q.campaign_id = ?")
		args = append(args, f.CampaignID)
	}
	if f.Status != "" {
		where = append(where, "q.status = ?")
		args = append(args, f.Status)
	}
	if f.Kind != "" {
		where = append(where, "q.kind = ?")
		args = append(args, f.Kind)
	}
	if f.Query != "" {
		where = append(where, "(LOWER(q.name) LIKE ? OR LOWER(COALESCE(q.slug, '')) LIKE ?)")
		pattern := LikePattern(f.Query)
		args = append(args, pattern, pattern)
	}

	clause := strings.Join(where, " AND ")

	var total int64
	if err := db.QueryRow(ctx,
		`SELECT COUNT(*) FROM qrcodes q WHERE `+clause,
		args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	order := "q.created_at DESC"
	switch f.Sort {
	case "created_at":
		order = "q.created_at ASC"
	case "-created_at":
		order = "q.created_at DESC"
	case "name":
		order = "q.name ASC"
	case "-name":
		order = "q.name DESC"
	case "scan_count":
		order = "q.scan_count ASC"
	case "-scan_count":
		order = "q.scan_count DESC"
	}

	limit := f.Limit
	if limit <= 0 {
		limit = 50
	}
	offset := f.Offset
	if offset < 0 {
		offset = 0
	}

	query := fmt.Sprintf(
		"%s WHERE %s ORDER BY %s LIMIT ? OFFSET ?",
		qrSelect, clause, order,
	)
	queryArgs := append(args, limit, offset)

	rows, err := db.Query(ctx, query, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]*QRCode, 0)
	for rows.Next() {
		q, err := scanQRCode(rows)
		if err != nil {
			return nil, 0, err
		}
		db.loadQRFile(ctx, q)
		items = append(items, q)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

type QRHistory struct {
	ID                  string
	QRCodeID            string
	Destination         string
	PreviousDestination *string
	ChangedByEmail      *string
	ChangedAt           int64
}

func (db *DB) AddHistory(ctx context.Context, qrID, destination string, previous *string, userID string) error {
	_, err := db.Exec(ctx, `
		INSERT INTO qrcode_history (
			id, qrcode_id, destination, previous_destination,
			changed_by, changed_at
		) VALUES (?, ?, ?, ?, ?, ?)`,
		NewID("qhist"), qrID, destination, previous, userID, Now())
	return err
}

func (db *DB) ListHistory(ctx context.Context, qrID string) ([]QRHistory, error) {
	rows, err := db.Query(ctx, `
		SELECT h.id, h.qrcode_id, h.destination,
			h.previous_destination, u.email, h.changed_at
		FROM qrcode_history h
		LEFT JOIN users u ON u.id = h.changed_by
		WHERE h.qrcode_id = ?
		ORDER BY h.changed_at DESC`, qrID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]QRHistory, 0)
	for rows.Next() {
		var h QRHistory
		if err := rows.Scan(
			&h.ID, &h.QRCodeID, &h.Destination,
			&h.PreviousDestination, &h.ChangedByEmail, &h.ChangedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, h)
	}
	return out, rows.Err()
}

var _ = errors.Is
var _ = sql.ErrNoRows
