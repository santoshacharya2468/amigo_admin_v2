// app/privacy-policy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src="./privacy-policy.pdf"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
}
