# Rithm

[![Implementación de Desarrollo](https://github.com/strut-software/rithm-front-end/actions/workflows/dev-deployments.yml/badge.svg)](https://github.com/strut-software/rithm-front-end/actions/workflows/dev-deployments.yml)

[![Implementación de Prueba](https://github.com/strut-software/rithm-front-end/actions/workflows/test-deployments.yml/badge.svg)](https://github.com/strut-software/rithm-front-end/actions/workflows/test-deployments.yml)

## Empezando

Clona el repositorio y realiza un 'npm i' en el directorio base para instalar todas las dependencias para el proyecto.
Asegúrate que estas corriendo la última versión LTS de Node.js ejecutando el comando 'node --version'. La última versión es requerida para el soporte ESLint.
Puedes correr la aplicación web usando el comando 'npm start' y abriendo Google Chrome para la dirección localhost especificada (normalmente [https://localhost:4200/](https://localhost:4200/)

NOTA: Puedes ver un mensaje que dice:
Tu conexión no es privada
Esto es porque nosotros usamos un certificado autofirmado para usar HTTPS localmente durante el desarrollo, así que tú no deberías preocuparte por esto. Si tu seleccionas 'Avanzado' o 'Mostrar detalles', tu deberías ser capaz de proceder a la página, que debería hacer este certificado confiable en tu sistema.

### Iniciar sesión

Puedes usar cualquiera de las siguientes credenciales pre-existentes para iniciar sesión:

| Correo                      | Contraseña  | Nota                                       |
| --------------------------- | ----------- | ------------------------------------------ |
| workeruser@inpivota.com     | R1thm?24601 |
| rithmuser@inpivota.com      | R1thm?24601 |
| supervisoruser@inpivota.com | R1thm?24601 |
| harrypotter@inpivota.com    | R1thm?24601 |
| rithmadmin@inpivota.com     | R1thm?24601 | Usuario tiene privilegios de administrador |
| marrypoppins@inpivota.com   | R1thm?24601 | El usuario no tiene estaciones             |

## Documentacion

La documentacion para el codigo front-end, la cobertura de prueba front-end, y la API de Back-end puede ser encontrada en nuestro sitio de documentacion(https://devapi.rithm.tech). Necesitaras iniciar sesion con las siguientes credenciales:

Nombre de usuario: `docuser` \
Contraseña: `R1thmD0c5`

## Implementaciones

Puedes encontrar la página web implementada en las siguientes ubicaciones. Cada una usa un entorno diferente, asi que usa la mejor que se adapte a tus necesidades.

[Desarrollo](https://devapp.rithm.tech) \
[Prueba](https://testapp.rithm.tech)

Nombre de usuario: `docuser` \
Contraseña: `R1thmD0c5`

## Scripts

`npm start`\
Corre la aplicación web localmente en tu sistema.

`npm run build`\
Construye la aplicación en la carpeta '/dist' sin correr el proyecto usando un entorno de desarrollo.
`npm run build-test`\
Construye la aplicación en la carpeta '/dist' sin correr el proyecto usando un entorno de prueba.
`npm run test`\
Ejerce la prueba resumida de la página y corre todas las pruebas definidas en el proyecto.
`npm run test-ci`\
Corre todas las pruebas definidas en el proyecto sin presentar una página web.
`npm run lint`\
Chequea todos los códigos del TypeScript/JavaScript para errores de hilo.
`npm run lint-style`\
Chequea todos los códigos del SCSS/CSS para errores de hilo.
`npm run compile-docs`\
Compila toda la documentación del JSDoc y Angular usando Compodoc.
`npm run compile-style-docs`\
Compila todo el estilo de documentación usando SassDoc.
`npm run a11y`\
Chequea el proyecto por problemas de acceso.
