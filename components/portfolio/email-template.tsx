import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div style={{
    fontFamily: 'sans-serif',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #eee'
  }}>
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>New Contact Form Message</h1>
    <div style={{ marginBottom: '15px' }}>
      <strong>From:</strong> {name} ({email})
    </div>
    <div style={{ marginBottom: '15px' }}>
      <strong>Subject:</strong> {subject}
    </div>
    <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #0070f3' }}>
      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>
    </div>
    <footer style={{ marginTop: '30px', color: '#888', fontSize: '12px' }}>
      Sent from your portfolio contact form.
    </footer>
  </div>
);
