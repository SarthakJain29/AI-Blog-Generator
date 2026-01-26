'use client';

import { useState, useEffect } from 'react';
import { capitalize, formatDate } from '@prescription-ai/utils';

export default function Home() {
    const [apiStatus, setApiStatus] = useState<string>('Checking...');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${apiUrl}/health`)
            .then((res) => res.json())
            .then((data) => setApiStatus(capitalize(data.status)))
            .catch(() => setApiStatus('Offline'));
    }, [apiUrl]);

    return (
        <div className="container">
            <main className="main">
                <h1 className="title">Prescription AI</h1>
                <p className="description">
                    Welcome to the Prescription AI monorepo powered by Turborepo
                </p>

                <div className="grid">
                    <div className="card">
                        <h2>🚀 Frontend</h2>
                        <p>Next.js 15 with React 19</p>
                        <p className="status">Status: Running</p>
                    </div>

                    <div className="card">
                        <h2>⚡ Backend API</h2>
                        <p>Express.js with TypeScript</p>
                        <p className="status">Status: {apiStatus}</p>
                    </div>

                    <div className="card">
                        <h2>📦 Shared Packages</h2>
                        <p>TypeScript Config, ESLint Config, Utils</p>
                        <p className="status">All configured</p>
                    </div>

                    <div className="card">
                        <h2>🎯 Build System</h2>
                        <p>Turborepo with Bun workspaces</p>
                        <p className="status">Ready to scale</p>
                    </div>
                </div>

                <div className="info">
                    <p>Current Date: {formatDate(new Date())}</p>
                    <p>API Endpoint: {apiUrl}</p>
                </div>
            </main>
        </div>
    );
}
