# 🚀 Manual de Deploy - TurnosMed

Manual completo paso a paso para desplegar la aplicación TurnosMed en producción.

## 📋 Tabla de Contenidos

1. [Preparación del Entorno](#preparación-del-entorno)
2. [Deploy en Windows 11](#deploy-en-windows-11)
3. [Deploy en Ubuntu Server LTS](#deploy-en-ubuntu-server-lts)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Variables de Entorno](#variables-de-entorno)
6. [Verificación del Deploy](#verificación-del-deploy)
7. [Mantenimiento y Monitoreo](#mantenimiento-y-monitoreo)

---

## 📚 Preparación del Entorno

### 1. **Verificar Código de Producción**

```bash
# Clonar o actualizar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd Proyecto_Final_arquitectura

# Verificar que todo compile correctamente
cd backend
npm install
npm run build

cd ../frontend
npm install
npm run build
```

### 2. **Preparar Archivos de Configuración**

#### Backend `.env.production`
```env
# Database (PostgreSQL en producción)
DATABASE_URL=postgresql://turnosmed:password@localhost:5432/turnosmed

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=tu-super-secret-jwt-key-production-256-bits
JWT_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12

# OpenAI (Opcional)
OPENAI_API_KEY=tu_openai_api_key
```

#### Frontend `.env.production`
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_OPENAI_API_KEY=tu_openai_api_key_opcional
```

---

## 🪟 Deploy en Windows 11

### **Paso 1: Instalar Dependencias**

1. **Instalar Node.js**
   - Descargar desde [nodejs.org](https://nodejs.org) (versión LTS 18+)
   - Verificar instalación:
   ```powershell
   node --version
   npm --version
   ```

2. **Instalar PostgreSQL**
   - Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - Durante la instalación, recordar la contraseña del usuario `postgres`
   - Agregar PostgreSQL al PATH del sistema

3. **Instalar PM2 (Process Manager)**
   ```powershell
   npm install -g pm2
   npm install -g pm2-windows-startup
   ```

### **Paso 2: Configurar PostgreSQL**

1. **Crear Base de Datos**
   ```powershell
   # Abrir SQL Shell (psql) desde el menú de inicio
   # Conectar como postgres (usar la contraseña configurada)
   
   # En psql:
   CREATE USER turnosmed WITH PASSWORD 'password_seguro_aqui';
   CREATE DATABASE turnosmed OWNER turnosmed;
   GRANT ALL PRIVILEGES ON DATABASE turnosmed TO turnosmed;
   \q
   ```

2. **Verificar Conexión**
   ```powershell
   psql -h localhost -U turnosmed -d turnosmed
   # Debería conectar sin errores
   ```

### **Paso 3: Configurar Backend**

1. **Preparar Backend**
   ```powershell
   cd Proyecto_Final_arquitectura\backend
   
   # Crear archivo .env
   copy .env.example .env
   # Editar .env con las configuraciones de producción
   ```

2. **Configurar variables en .env**
   ```env
   DATABASE_URL=postgresql://turnosmed:password_seguro_aqui@localhost:5432/turnosmed
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=clave-secreta-256-bits-generada
   ```

3. **Instalar y Construir**
   ```powershell
   npm install
   npm run build
   
   # Ejecutar script de base de datos
   psql -h localhost -U turnosmed -d turnosmed -f database\init.sql
   ```

4. **Configurar PM2**
   ```powershell
   # Crear archivo ecosystem.config.js
   @"
   module.exports = {
     apps: [{
       name: 'turnosmed-backend',
       script: 'dist/index.js',
       cwd: 'C:/ruta/completa/al/backend',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       },
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G'
     }]
   };
   "@ | Out-File -FilePath ecosystem.config.js -Encoding UTF8
   
   # Iniciar con PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2-startup install
   ```

### **Paso 4: Configurar Frontend**

1. **Preparar Frontend**
   ```powershell
   cd ..\frontend
   
   # Crear archivo .env.production
   @"
   VITE_API_BASE_URL=http://localhost:3001/api/v1
   "@ | Out-File -FilePath .env.production -Encoding UTF8
   ```

2. **Construir para Producción**
   ```powershell
   npm install
   npm run build
   ```

3. **Servir con PM2**
   ```powershell
   # Instalar serve para servir archivos estáticos
   npm install -g serve
   
   # Crear configuración PM2 para frontend
   @"
   module.exports = {
     apps: [{
       name: 'turnosmed-frontend',
       script: 'serve',
       args: '-s dist -l 5173',
       cwd: 'C:/ruta/completa/al/frontend',
       env: {
         NODE_ENV: 'production'
       },
       instances: 1,
       autorestart: true
     }]
   };
   "@ | Out-File -FilePath ecosystem.frontend.config.js -Encoding UTF8
   
   pm2 start ecosystem.frontend.config.js
   pm2 save
   ```

### **Paso 5: Configurar Firewall de Windows**

```powershell
# Permitir puertos en el firewall
New-NetFirewallRule -DisplayName "TurnosMed Backend" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
New-NetFirewallRule -DisplayName "TurnosMed Frontend" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow
```

---

## 🐧 Deploy en Ubuntu Server LTS

### **Paso 1: Preparar el Servidor**

1. **Actualizar Sistema**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Instalar Node.js 18 LTS**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Verificar instalación
   node --version
   npm --version
   ```

3. **Instalar PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Instalar Nginx**
   ```bash
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **Instalar PM2**
   ```bash
   sudo npm install -g pm2
   ```

### **Paso 2: Configurar PostgreSQL**

```bash
# Configurar PostgreSQL
sudo -u postgres psql

-- En psql:
CREATE USER turnosmed WITH PASSWORD 'password_seguro_aqui';
CREATE DATABASE turnosmed OWNER turnosmed;
GRANT ALL PRIVILEGES ON DATABASE turnosmed TO turnosmed;
\q

# Configurar autenticación
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Agregar la línea:
# local   turnosmed       turnosmed                               md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Verificar conexión
psql -h localhost -U turnosmed -d turnosmed
```

### **Paso 3: Crear Usuario de Aplicación**

```bash
# Crear usuario dedicado
sudo adduser turnosmed
sudo usermod -aG sudo turnosmed

# Cambiar a usuario turnosmed
sudo su - turnosmed
```

### **Paso 4: Deploy del Backend**

```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd Proyecto_Final_arquitectura/backend

# Configurar variables de entorno
cp .env.example .env
nano .env
# Configurar todas las variables necesarias

# Instalar dependencias y construir
npm install
npm run build

# Ejecutar script de base de datos
psql -h localhost -U turnosmed -d turnosmed -f database/init.sql

# Crear configuración PM2
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'turnosmed-backend',
    script: 'dist/index.js',
    cwd: '/home/turnosmed/Proyecto_Final_arquitectura/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/home/turnosmed/logs/backend-error.log',
    out_file: '/home/turnosmed/logs/backend-out.log',
    log_file: '/home/turnosmed/logs/backend.log'
  }]
};
EOL

# Crear directorio de logs
mkdir -p /home/turnosmed/logs

# Iniciar backend con PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### **Paso 5: Deploy del Frontend**

```bash
# Cambiar a carpeta frontend
cd ../frontend

# Configurar variables de entorno
cat > .env.production << EOL
VITE_API_BASE_URL=http://localhost:3001/api/v1
EOL

# Construir para producción
npm install
npm run build

# Mover archivos al directorio de Nginx
sudo mkdir -p /var/www/turnosmed
sudo cp -r dist/* /var/www/turnosmed/
sudo chown -R www-data:www-data /var/www/turnosmed
```

### **Paso 6: Configurar Nginx**

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/turnosmed

# Contenido del archivo:
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        root /var/www/turnosmed;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Headers de seguridad
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /var/www/turnosmed;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/turnosmed /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### **Paso 7: Configurar Firewall**

```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432/tcp  # PostgreSQL (solo si necesitas acceso externo)
sudo ufw --force enable
sudo ufw status
```

### **Paso 8: Configurar SSL (Opcional)**

```bash
# Instalar Certbot para SSL gratuito
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Solo si tienes un dominio configurado:
# sudo certbot --nginx -d tu-dominio.com
# sudo certbot renew --dry-run
```

---

## 🗄️ Configuración de Base de Datos

### **Optimizaciones de PostgreSQL (Ambos Sistemas)**

#### Windows 11:
```powershell
# Abrir SQL Shell (psql) como administrador
psql -h localhost -U postgres

-- Optimizaciones de producción
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
SELECT pg_reload_conf();
```

#### Ubuntu Server LTS:
```bash
sudo -u postgres psql

-- Optimizaciones de producción
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
SELECT pg_reload_conf();

\q
sudo systemctl restart postgresql
```

### **Backup Automático**

#### Windows 11:
```powershell
# Crear script de backup (backup.ps1)
@"
`$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
`$BACKUP_PATH = "C:\backups\turnosmed"
if (!(Test-Path `$BACKUP_PATH)) { New-Item -ItemType Directory -Path `$BACKUP_PATH }

# Ejecutar backup
& "C:\Program Files\PostgreSQL\14\bin\pg_dump.exe" -h localhost -U turnosmed -d turnosmed -f "`$BACKUP_PATH\backup_`$DATE.sql"

# Limpiar backups antiguos (más de 7 días)
Get-ChildItem `$BACKUP_PATH -Name "backup_*.sql" | Where-Object { `$_.CreationTime -lt (Get-Date).AddDays(-7) } | Remove-Item
"@ | Out-File -FilePath C:\scripts\backup.ps1 -Encoding UTF8

# Programar tarea en Windows Task Scheduler
schtasks /create /tn "TurnosMed Backup" /tr "powershell.exe -File C:\scripts\backup.ps1" /sc daily /st 02:00
```

#### Ubuntu Server LTS:
```bash
# Crear script de backup
sudo mkdir -p /home/turnosmed/backups
cat > /home/turnosmed/backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="/home/turnosmed/backups"
pg_dump -h localhost -U turnosmed turnosmed > $BACKUP_PATH/backup_$DATE.sql
find $BACKUP_PATH -name "backup_*.sql" -mtime +7 -delete
EOL

chmod +x /home/turnosmed/backup.sh

# Programar backup diario
crontab -e
# Agregar: 0 2 * * * /home/turnosmed/backup.sh
```

---

## ⚙️ Variables de Entorno

### **Variables Críticas de Producción**

#### Para Windows 11:
```env
# Backend (.env)
DATABASE_URL=postgresql://turnosmed:password@localhost:5432/turnosmed
JWT_SECRET=clave-secreta-256-bits-minimo
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=12

# Frontend (.env.production)
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

#### Para Ubuntu Server LTS:
```env
# Backend (.env)
DATABASE_URL=postgresql://turnosmed:password@localhost:5432/turnosmed
JWT_SECRET=clave-secreta-256-bits-minimo
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost
BCRYPT_ROUNDS=12

# Frontend (.env.production)
VITE_API_BASE_URL=http://localhost/api/v1
```

### **Generar JWT Secret Seguro (Ambos Sistemas)**

```bash
# Generar secret key seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Verificación del Deploy

### **1. Verificar Backend**

#### Windows 11:
```powershell
# Test de salud del API
Invoke-WebRequest -Uri "http://localhost:3001/api/v1/health" -Method GET

# Verificar estado de PM2
pm2 status

# Ver logs
pm2 logs turnosmed-backend
```

#### Ubuntu Server LTS:
```bash
# Test de salud del API
curl http://localhost:3001/api/v1/health

# Verificar estado de PM2
pm2 status

# Ver logs
pm2 logs turnosmed-backend

# Verificar Nginx
sudo systemctl status nginx
```

### **2. Verificar Frontend**

#### Windows 11:
```powershell
# Verificar que carga correctamente
Invoke-WebRequest -Uri "http://localhost:5173" -Method GET

# Verificar estado de PM2
pm2 status
```

#### Ubuntu Server LTS:
```bash
# Verificar que carga correctamente
curl -I http://localhost

# Verificar Nginx
sudo nginx -t
curl -I http://localhost/assets/
```

### **3. Verificar Base de Datos (Ambos Sistemas)**

```sql
-- Conectar y verificar tablas
psql -h localhost -U turnosmed -d turnosmed

\dt

-- Verificar datos de ejemplo
SELECT COUNT(*) FROM servicios;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM turnos;
\q
```

### **4. Test de Funcionalidad Completa**

```bash
# Test de registro de usuario
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test User","password":"Test123!"}'

# Test de login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

---

## 📊 Monitoreo y Mantenimiento

### **1. Logs del Sistema**

#### Windows 11:
```powershell
# Backend logs (PM2)
pm2 logs turnosmed-backend

# Frontend logs (PM2)
pm2 logs turnosmed-frontend

# PostgreSQL logs
# Logs ubicados en: C:\Program Files\PostgreSQL\14\data\log\

# Eventos de Windows
Get-EventLog -LogName Application -Source "TurnosMed*" -Newest 50
```

#### Ubuntu Server LTS:
```bash
# Backend logs (PM2)
pm2 logs turnosmed-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Logs del sistema
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

### **2. Monitoreo de Performance**

#### Windows 11:
```powershell
# Monitor PM2
pm2 monit

# Monitor sistema Windows
Get-Process -Name node
Get-Counter "\Memory\Available MBytes"
Get-Counter "\Processor(_Total)\% Processor Time"

# Espacio en disco
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace
```

#### Ubuntu Server LTS:
```bash
# Monitor PM2
pm2 monit

# Monitor sistema
htop
df -h
free -m
iostat 1

# Monitor de red
netstat -tulpn | grep :3001
netstat -tulpn | grep :80
```

### **3. Actualizaciones**

#### Windows 11:
```powershell
# Actualizar aplicación
cd C:\ruta\a\Proyecto_Final_arquitectura
git pull origin main

# Backend
cd backend
npm install
npm run build
pm2 restart turnosmed-backend

# Frontend
cd ..\frontend
npm install
npm run build
pm2 restart turnosmed-frontend
```

#### Ubuntu Server LTS:
```bash
# Actualizar aplicación
cd /home/turnosmed/Proyecto_Final_arquitectura
git pull origin main

# Backend
cd backend
npm install
npm run build
pm2 restart turnosmed-backend

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/turnosmed/
sudo systemctl reload nginx
```

---

## 🚨 Troubleshooting Común

### **Error: No puede conectar a PostgreSQL**

#### Windows 11:
```powershell
# Verificar servicio PostgreSQL
Get-Service -Name "postgresql*"

# Reiniciar si es necesario
Restart-Service postgresql-x64-14

# Verificar conexión
psql -h localhost -U turnosmed -d turnosmed
```

#### Ubuntu Server LTS:
```bash
# Verificar servicio
sudo systemctl status postgresql

# Reiniciar si es necesario
sudo systemctl restart postgresql

# Verificar conexión
psql -h localhost -U turnosmed -d turnosmed

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### **Error: Puerto en uso**

#### Windows 11:
```powershell
# Verificar qué está usando el puerto
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Terminar proceso si es necesario
taskkill /PID [PID_NUMBER] /F
```

#### Ubuntu Server LTS:
```bash
# Verificar qué está usando el puerto
sudo lsof -i :3001
sudo lsof -i :80

# Terminar proceso si es necesario
sudo kill [PID_NUMBER]
```

### **Error: CORS en producción**

```typescript
// backend/src/index.ts - Configuración para ambos sistemas
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### **Error: 404 en rutas del frontend (Solo Ubuntu)**

```nginx
# En la configuración de Nginx (/etc/nginx/sites-available/turnosmed)
location / {
    root /var/www/turnosmed;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

---

## 📈 Optimizaciones de Producción

### **1. Optimizaciones de Windows 11**

```powershell
# Configurar Windows para mejor performance
# Deshabilitar indexación en carpeta del proyecto
fsutil behavior query DisableLastAccess

# Configurar prioridad alta para Node.js
Get-Process -Name node | ForEach-Object { $_.PriorityClass = 'High' }

# Configurar paginación virtual
wmic computersystem where name="%computername%" set AutomaticManagedPagefile=False
wmic pagefileset where name="C:\\pagefile.sys" set InitialSize=4096,MaximumSize=8192
```

### **2. Optimizaciones de Ubuntu Server LTS**

```bash
# Optimizar límites del sistema
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimizar red
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Optimizar Nginx
sudo nano /etc/nginx/nginx.conf
# worker_processes auto;
# worker_connections 1024;
# keepalive_timeout 65;
```

### **3. Optimizaciones de PM2 (Ambos Sistemas)**

```bash
# Configurar PM2 para producción
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## ✅ Checklist Final

### **Windows 11:**
- [ ] Node.js 18+ instalado
- [ ] PostgreSQL instalado y configurado
- [ ] PM2 instalado y configurado
- [ ] Backend desplegado con PM2
- [ ] Frontend desplegado con PM2 + serve
- [ ] Base de datos inicializada con datos de ejemplo
- [ ] Variables de entorno configuradas
- [ ] Firewall configurado para permitir puertos
- [ ] Backup automático configurado
- [ ] Tests de funcionalidad pasando

### **Ubuntu Server LTS:**
- [ ] Servidor actualizado
- [ ] Node.js 18+ instalado
- [ ] PostgreSQL instalado y configurado
- [ ] Nginx instalado y configurado
- [ ] PM2 instalado y configurado
- [ ] Usuario dedicado creado
- [ ] Backend desplegado con PM2
- [ ] Frontend servido por Nginx
- [ ] Base de datos inicializada con datos de ejemplo
- [ ] Variables de entorno configuradas
- [ ] Firewall (UFW) configurado
- [ ] SSL configurado (opcional)
- [ ] Backup automático configurado
- [ ] Logs accesibles y funcionando
- [ ] Tests de funcionalidad pasando

---

## 🎯 Acceso a la Aplicación

### **Windows 11:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Base de Datos**: localhost:5432

### **Ubuntu Server LTS:**
- **Frontend**: http://localhost (puerto 80)
- **Backend API**: http://localhost/api/v1
- **Base de Datos**: localhost:5432

---

**🎉 ¡Felicitaciones! Tu aplicación TurnosMed está ahora desplegada en producción.**

### 📞 **Soporte Adicional:**
- Consultar documentación técnica en `documentación/`
- Revisar logs de PM2: `pm2 logs`
- Verificar estado de servicios según el sistema operativo
- Consultar logs de base de datos para troubleshooting

### 🚀 **Próximos Pasos:**
1. Configurar monitoreo continuo
2. Implementar backups automáticos
3. Configurar alertas por email/SMS
4. Optimizar performance según carga de usuarios
5. Configurar dominio personalizado (opcional)
