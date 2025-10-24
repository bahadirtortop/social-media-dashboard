import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #ddd' }}>
      <p>
        &copy; 2025 Your Company. All rights reserved.
        <br />
        <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Service</Link>
      </p>
    </footer>
  );
};

export default Footer;