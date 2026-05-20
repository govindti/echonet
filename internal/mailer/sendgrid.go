package mailer

import (
	"bytes"
	"fmt"
	"html/template"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type SendGridMailer struct {
	fromEmail string
	apiKey    string
	clint     *sendgrid.Client
}

func NewSendgrid(apiKey string, fromEmail string) *SendGridMailer {
	client := sendgrid.NewSendClient(apiKey)

	return &SendGridMailer{
		fromEmail: fromEmail,
		apiKey:    apiKey,
		clint:     client,
	}
}

func (m *SendGridMailer) Send(templateFile, username, email string, data any, isSendBox bool) (int, error) {
	from := mail.NewEmail(FromName, m.fromEmail)
	to := mail.NewEmail(username, email)

	// template parshing & building
	tmpl, err := template.ParseFS(FS, "templates/"+templateFile)
	if err != nil {
		return -1, err
	}

	subject := new(bytes.Buffer)
	err = tmpl.ExecuteTemplate(subject, "subject", data)
	if err != nil {
		return -1, err
	}

	body := new(bytes.Buffer)
	err = tmpl.ExecuteTemplate(body, "body", data)
	if err != nil {
		return -1, err
	}

	message := mail.NewSingleEmail(from, subject.String(), to, "", body.String())

	mailSettings := mail.NewMailSettings()
	mailSettings.SetSandboxMode(mail.NewSetting(isSendBox))
	message.SetMailSettings(mailSettings)

	var retryErr error
	for i := 0; i < maxRetires; i++ {
		response, retryErr := m.clint.Send(message)
		if retryErr != nil {
			// exponential backoff
			time.Sleep(time.Second * time.Duration(i+1))
			continue
		}

		return response.StatusCode, nil
	}

	return -1, fmt.Errorf("failed to send email after %d attempt, error: %v", maxRetires, retryErr)
}
