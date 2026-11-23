import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() { return <div className="container not-found"><span className="eyebrow">404 / OUT OF BOUNDS</span><h1>That one's<br/><i>out.</i></h1><p>We couldn't find the page you were looking for.</p><Link to="/" className="button button-dark"><ArrowLeft size={17}/> Back to home</Link></div>; }
