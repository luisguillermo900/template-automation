# Template Automation System

> username = 'admin' & password = 'admin123';

## Configuración

Sigue estos pasos para configurar el sistema de automatización de plantillas:

1. **Clonar el repositorio**

```
https://github.com/atipaq/template-automation-system.git
```

```
cd requirements-system
```

2. **Configuración del backend**

```
cd backend
npm install
npm run dev
```

> El backend estará corriendo en http://localhost:5000 (o el puerto configurado en el archivo .env).

Backend .env:
Crea un archivo .env en la carpeta backend con el siguiente contenido:

```
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL="postgresql://postgres.nkjudkvrqcmfuvfzpjxe:pass-system-pis@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://postgres.nkjudkvrqcmfuvfzpjxe:pass-system-pis@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Port for the backend server
PORT=5000
```

3. **Configuración del frontend**

```
cd ../frontend
npm install
npm start
```

> El frontend estará corriendo en http://localhost:3000 (o el puerto configurado en el archivo .env).

Frontend .env:
Crea un archivo .env en la carpeta frontend con el siguiente contenido:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```
