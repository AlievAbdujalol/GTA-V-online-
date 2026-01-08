const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

const servers = new Map(); // Активные серверы

app.post('/create-gta-server', (req, res) => {
    const id = Date.now().toString();
    const ip = 'your-vps-ip.com'; // Твой VPS/DigitalOcean
    const port = 30000 + Math.floor(Math.random() * 1000);
    
    // Запуск Docker контейнера FiveM
    exec(`docker run -d -p ${port}:30120 --name gta-${id} citizenfx/fivem-server`, (err) => {
        if (err) return res.status(500).json({error: 'Server failed'});
        
        servers.set(id, {port, pid: `gta-${id}`});
        res.json({id, ip, port, connect: `connect ${ip}:${port}`});
    });
});

app.delete('/kill-server/:id', (req, res) => {
    const server = servers.get(req.params.id);
    if (server) {
        exec(`docker stop ${server.pid} && docker rm ${server.pid}`);
        servers.delete(req.params.id);
    }
    res.json({success: true});
});

app.listen(3000, () => console.log('GTA Launcher API on port 3000'));