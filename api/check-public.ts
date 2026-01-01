
async function main() {
    try {
        const res = await fetch('http://localhost:3001/courses', {
            headers: { 'X-Tenant-Id': 'demo' }
        });
        console.log('Status:', res.status);
        if (res.ok) {
            const data = await res.json();
            console.log('Courses:', Array.isArray(data) ? data.length : 'Not an array');
        } else {
            console.log('Error text:', await res.text());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
