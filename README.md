# Calculadora de Costos para Emprendedores - Guía de Implementación

## 📋 Descripción General

Esta aplicación web te permite gestionar los costos de tu emprendimiento de manera profesional y precisa. Es completamente genérica y se adapta a cualquier tipo de producto o servicio.

### 🎯 Características Principales

- **Gestión de Insumos**: Añade productos con conversión automática de unidades
- **Calculadora de Costos**: Calcula el precio final de tus productos
- **Conversión de Unidades**: Soporte para peso (kg/g), líquidos (l/ml), longitud (m/cm), y unidades
- **Cálculos Precisos**: Incluye desperdicio, costos fijos y mano de obra
- **Interfaz Moderna**: Diseño responsive y fácil de usar

## 🚀 Cómo Usar la Aplicación

### Paso 1: Gestión de Insumos

1. **Añadir un Insumo**:
   - Nombre: Ej. "Harina de trigo"
   - Cantidad: Ej. "5" 
   - Unidad: Selecciona "Kilogramo"
   - Precio Total: Ej. "$20"

2. **Conversión Automática**:
   - El sistema convierte automáticamente 5kg → 5000g
   - Calcula el valor por gramo: $20 ÷ 5000g = $0.004 por gramo

3. **Gestionar Insumos**:
   - Ver lista completa de insumos
   - Editar o eliminar insumos existentes

### Paso 2: Calculadora de Costos

1. **Crear Producto Final**:
   - Nombre: Ej. "Torta de Chocolate - 20 porciones"
   - Cantidad del pedido: Ej. "2" (dos tortas)

2. **Seleccionar Ingredientes**:
   - Escoge "Harina de trigo" del dropdown
   - Cantidad requerida: "1000" gramos
   - Clic en "Agregar Ingrediente"
   - Repite para todos los ingredientes

3. **Gastos Adicionales**:
   - Concepto: "Gas para hornear"
   - Valor: "$10"
   - Añadir más gastos según necesites

4. **Configurar Porcentajes**:
   - Desperdicio: 10% (pérdidas durante producción)
   - Costos Fijos: 20% (servicios, herramientas, etc.)
   - Mano de Obra: 50% (tu trabajo y ganancia)

### Paso 3: Resultado Final

La aplicación calcula automáticamente:
- Costo de cada ingrediente
- Subtotal de ingredientes
- Gastos adicionales
- Valor del desperdicio
- Valor de costos fijos
- Valor de mano de obra
- **Costo por unidad**
- **Costo total del pedido**

## 🌐 Opciones de Hosting Gratuito

### Opción 1: Netlify (Recomendado)
1. Visita [netlify.com](https://netlify.com)
2. Crea una cuenta gratuita
3. Arrastra la carpeta con todos los archivos a la zona de deploy
4. ¡Listo! Tu aplicación estará online

### Opción 2: GitHub Pages
1. Sube los archivos a un repositorio en GitHub
2. Ve a Settings → Pages
3. Selecciona la rama main como source
4. Tu aplicación estará en `usuario.github.io/repositorio`

### Opción 3: Vercel
1. Visita [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio
4. Deploy automático

### Opción 4: Firebase Hosting
1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Inicia proyecto: `firebase init hosting`
3. Deploy: `firebase deploy`

## 📁 Estructura de Archivos

```
calculadora-costos/
│
├── index.html          # Estructura principal de la aplicación
├── style.css           # Estilos y diseño responsive
├── app.js             # Lógica de la aplicación (MVC)
└── README.md          # Esta documentación
```

## 🔧 Personalización

### Añadir Nuevas Unidades de Medida

En el archivo `app.js`, modifica el array `unidadesMedida`:

```javascript
{
    id: "nueva_unidad", 
    nombre: "Nueva Unidad", 
    factor_conversion: 100, 
    tipo: "nuevo_tipo", 
    unidad_base: "unidad_convertida"
}
```

### Modificar Porcentajes por Defecto

```javascript
this.porcentajesDefault = {
    desperdicio: 15,      // 15% en lugar de 10%
    costos_fijos: 25,     // 25% en lugar de 20%
    mano_obra: 60         // 60% en lugar de 50%
};
```

### Cambiar Colores y Estilos

Modifica las variables CSS en `style.css`:

```css
:root {
    --color-primary: #tu-color-principal;
    --color-secondary: #tu-color-secundario;
}
```

## 💡 Tips de Uso

1. **Precisión en Conversiones**: Siempre verifica que las unidades sean correctas
2. **Actualización de Precios**: Mantén actualizados los precios de tus insumos
3. **Backup de Datos**: Como los datos se almacenan en memoria, considera exportar tu información importante
4. **Testing**: Siempre haz pruebas con productos conocidos para verificar cálculos

## 🐛 Solución de Problemas Comunes

### La aplicación no carga
- Verifica que todos los archivos estén en el mismo directorio
- Asegúrate de que el hosting soporte archivos HTML/CSS/JS

### Los cálculos no son precisos
- Revisa que las unidades de medida sean las correctas
- Verifica que los factores de conversión estén bien configurados

### Problemas de diseño en móvil
- La aplicación es responsive, pero algunos hostings pueden requerir configuración adicional

## 📞 Soporte

Esta aplicación fue diseñada para ser:
- ✅ Completamente gratuita
- ✅ Fácil de usar
- ✅ Adaptable a cualquier negocio
- ✅ Sin necesidad de base de datos
- ✅ Compatible con hosting gratuito

## 🔄 Futuras Mejoras Posibles

1. Exportación de resultados a PDF
2. Integración con APIs de precios
3. Sistema de usuarios y autenticación
4. Base de datos para persistencia
5. Modo offline con Service Workers

---

¡Esperamos que esta calculadora te ayude a hacer crecer tu emprendimiento con precios justos y rentables! 🚀
