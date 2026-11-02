package config

import "testing"

func TestLoadDefaults(t *testing.T) {
	for _, k := range []string{"QRNova_ADDR", "PORT", "QRNova_BASE_URL", "QRNova_DATABASE_URL", "QRNova_COOKIE_SECURE", "QRNova_REGISTRATION", "QRNova_FILE_UPLOADS"} {
		t.Setenv(k, "")
	}
	c, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if c.Addr != ":8080" || c.DatabaseURL != "sqlite://data/QRNova.db" || c.CookieSecure || !c.RegistrationOpen {
		t.Fatalf("unexpected defaults: %+v", c)
	}
	if c.FileUploads.Enabled {
		t.Fatal("file uploads must be off unless explicitly enabled")
	}
}

func TestLoadEnv(t *testing.T) {
	t.Setenv("QRNova_BASE_URL", "https://qr.example.com/")
	t.Setenv("QRNova_REGISTRATION", "closed")
	t.Setenv("QRNova_TRUSTED_PROXIES", "10.0.0.0/8, 172.18.0.2")
	t.Setenv("QRNova_RATE_LIMIT_REDIRECT", "30")
	t.Setenv("QRNova_FILE_UPLOADS", "enabled")
	t.Setenv("QRNova_FILE_MAX_BYTES", "2097152")
	c, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if c.BaseURLString() != "https://qr.example.com" || c.BaseHost() != "qr.example.com" {
		t.Fatalf("base url: %s", c.BaseURLString())
	}
	if !c.CookieSecure {
		t.Fatal("https base URL should enable secure cookies automatically")
	}
	if c.RegistrationOpen || len(c.TrustedProxies) != 2 || c.RateLimits.RedirectPerIP != 30 {
		t.Fatalf("env not applied: %+v", c)
	}
	if !c.FileUploads.Enabled || c.FileUploads.MaxBytes != 2<<20 {
		t.Fatalf("file upload env not applied: %+v", c.FileUploads)
	}
}

func TestLoadRejectsInvalid(t *testing.T) {
	cases := map[string]string{
		"QRNova_BASE_URL":        "ftp://x",
		"QRNova_REGISTRATION":    "maybe",
		"QRNova_TRUSTED_PROXIES": "not-an-ip",
		"QRNova_SMTP_PORT":       "99999",
		"QRNova_MAX_BODY_BYTES":  "10",
		"QRNova_FILE_UPLOADS":    "yes",
		"QRNova_FILE_MAX_BYTES":  "12",
	}
	for k, v := range cases {
		t.Run(k, func(t *testing.T) {
			t.Setenv(k, v)
			if _, err := Load(); err == nil {
				t.Fatalf("%s=%s should be rejected", k, v)
			}
		})
	}
}
