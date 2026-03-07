
export const TEMPLATE_REGISTRY = {
    'unified-working-template': {
        id: 'unified-working-template',
        name: 'Unified Working Template',
        config: {
            regions: {
                sidebar: {
                    width: '30%',
                    styles: {
                        background: '#f8fafc',
                        padding: '24px',
                        borderRight: '1px solid #e2e8f0',
                        color: '#334155'
                    }
                },
                main: {
                    width: '70%',
                    styles: {
                        padding: '32px',
                        background: '#ffffff',
                        color: '#1e293b'
                    }
                }
            },
            containerStyles: {
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                fontFamily: "Inter, sans-serif"
            }
        },
        styles: {
            header: {
                textTransform: 'uppercase',
                borderBottom: '2px solid #334155',
                paddingBottom: '8px',
                marginBottom: '16px',
                fontSize: '1rem',
                letterSpacing: '0.05em',
                fontWeight: '700',
                color: '#1e293b'
            },
            text: {
                fontSize: '0.9rem',
                lineHeight: '1.5', // Match index.css root
                color: '#334155'
            }
        },
        defaultLayout: {
            sidebar: ['personal', 'skills', 'languages'],
            main: ['summary', 'experience', 'projects', 'education']
        }
    }
};
