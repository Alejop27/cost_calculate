// Calculadora de Costos para Emprendedores - JavaScript
// Implementación con patrón MVC del lado cliente

/**
 * MODELO - Manejo de datos y lógica de negocio
 */
class ModeloCalculadora {
    constructor() {
        // Datos de configuración de unidades de medida
        this.unidadesMedida = [
            {id: "kg", nombre: "Kilogramo", factor_conversion: 1000, tipo: "peso", unidad_base: "g"},
            {id: "g", nombre: "Gramo", factor_conversion: 1, tipo: "peso", unidad_base: "g"}, 
            {id: "ml", nombre: "Mililitro", factor_conversion: 1, tipo: "liquido", unidad_base: "ml"},
            {id: "l", nombre: "Litro", factor_conversion: 1000, tipo: "liquido", unidad_base: "ml"},
            {id: "und", nombre: "Unidad", factor_conversion: 1, tipo: "unidad", unidad_base: "und"},
            {id: "cm", nombre: "Centímetro", factor_conversion: 1, tipo: "longitud", unidad_base: "cm"},
            {id: "m", nombre: "Metro", factor_conversion: 100, tipo: "longitud", unidad_base: "cm"}
        ];

        // Porcentajes por defecto
        this.porcentajesDefault = {
            desperdicio: 10,
            costos_fijos: 20,
            mano_obra: 50
        };

        // Arrays para almacenar los datos en memoria
        this.insumos = [];
        this.historialCalculos = [];
        this.calculoActual = null;
    }

    /**
     * Obtiene información de una unidad de medida por su ID
     */
    obtenerUnidad(id) {
        return this.unidadesMedida.find(unidad => unidad.id === id);
    }

    /**
     * Convierte una cantidad de una unidad a su unidad base
     */
    convertirAUnidadBase(cantidad, unidadId) {
        const unidad = this.obtenerUnidad(unidadId);
        if (!unidad) return { cantidad: 0, unidad: '' };
        
        return {
            cantidad: cantidad * unidad.factor_conversion,
            unidad: unidad.unidad_base
        };
    }

    /**
     * Añade un nuevo insumo
     */
    añadirInsumo(nombre, cantidad, unidad, precio) {
        const conversion = this.convertirAUnidadBase(cantidad, unidad);
        const valorPorUnidad = precio / conversion.cantidad;

        const insumo = {
            id: Date.now(),
            nombre: nombre.trim(),
            cantidadOriginal: cantidad,
            unidadOriginal: unidad,
            precioTotal: precio,
            cantidadConvertida: conversion.cantidad,
            unidadConvertida: conversion.unidad,
            valorPorUnidad: valorPorUnidad
        };

        this.insumos.push(insumo);
        return insumo;
    }

    /**
     * Obtiene todos los insumos
     */
    obtenerInsumos() {
        return this.insumos;
    }

    /**
     * Elimina un insumo por ID
     */
    eliminarInsumo(id) {
        this.insumos = this.insumos.filter(insumo => insumo.id !== id);
    }

    /**
     * Busca un insumo por ID
     */
    obtenerInsumo(id) {
        return this.insumos.find(insumo => insumo.id == id);
    }

    /**
     * Calcula el costo de un ingrediente específico
     */
    calcularCostoIngrediente(insumoId, cantidadRequerida) {
        const insumo = this.obtenerInsumo(insumoId);
        if (!insumo) return 0;
        
        return cantidadRequerida * insumo.valorPorUnidad;
    }

    /**
     * Realiza el cálculo completo de costos
     */
    calcularCostos(datosProducto) {
        const {
            nombre,
            cantidadPedido,
            ingredientes,
            gastos,
            porcentajeDesperdicio,
            porcentajeCostosFijos,
            porcentajeManoObra
        } = datosProducto;

        // Cálculo del subtotal de ingredientes
        let subtotalIngredientes = 0;
        const detalleIngredientes = [];

        for (const ingrediente of ingredientes) {
            const insumo = this.obtenerInsumo(ingrediente.insumoId);
            if (insumo) {
                const costoIngrediente = this.calcularCostoIngrediente(ingrediente.insumoId, ingrediente.cantidad);
                subtotalIngredientes += costoIngrediente;
                
                detalleIngredientes.push({
                    nombre: insumo.nombre,
                    cantidad: ingrediente.cantidad,
                    unidad: insumo.unidadConvertida,
                    precioUnitario: insumo.valorPorUnidad,
                    total: costoIngrediente
                });
            }
        }

        // Cálculo de gastos adicionales
        const totalGastos = gastos.reduce((total, gasto) => total + gasto.costo, 0);

        // Subtotal base
        const subtotalBase = subtotalIngredientes + totalGastos;

        // Aplicación de porcentajes
        const valorDesperdicio = subtotalBase * (porcentajeDesperdicio / 100);
        const subtotalConDesperdicio = subtotalBase + valorDesperdicio;

        const valorCostosFijos = subtotalConDesperdicio * (porcentajeCostosFijos / 100);
        const subtotalConCostosFijos = subtotalConDesperdicio + valorCostosFijos;

        const valorManoObra = subtotalConCostosFijos * (porcentajeManoObra / 100);
        const costoUnitarioFinal = subtotalConCostosFijos + valorManoObra;

        // Costo total del pedido
        const totalPedido = costoUnitarioFinal * cantidadPedido;

        const resultado = {
            nombreProducto: nombre,
            cantidadPedido: cantidadPedido,
            subtotalIngredientes: subtotalIngredientes,
            totalGastos: totalGastos,
            subtotalBase: subtotalBase,
            valorDesperdicio: valorDesperdicio,
            valorCostosFijos: valorCostosFijos,
            valorManoObra: valorManoObra,
            costoUnitarioFinal: costoUnitarioFinal,
            totalPedido: totalPedido,
            detalleIngredientes: detalleIngredientes,
            gastos: gastos,
            porcentajes: {
                desperdicio: porcentajeDesperdicio,
                costosFijos: porcentajeCostosFijos,
                manoObra: porcentajeManoObra
            },
            fecha: new Date()
        };

        this.calculoActual = resultado;
        return resultado;
    }

    /**
     * Guarda el cálculo actual en el historial
     */
    guardarCalculoEnHistorial() {
        if (this.calculoActual) {
            this.historialCalculos.unshift({
                id: Date.now(),
                ...this.calculoActual
            });
        }
    }

    /**
     * Obtiene el historial de cálculos
     */
    obtenerHistorial() {
        return this.historialCalculos;
    }

    /**
     * Limpia el historial
     */
    limpiarHistorial() {
        this.historialCalculos = [];
    }

    /**
     * Elimina un cálculo del historial
     */
    eliminarDelHistorial(id) {
        this.historialCalculos = this.historialCalculos.filter(calculo => calculo.id !== id);
    }
}

/**
 * VISTA - Manejo de la interfaz de usuario
 */
class VistaCalculadora {
    constructor() {
        this.elementos = this.obtenerElementosDOM();
        this.configurarEventosNavegacion();
    }

    /**
     * Obtiene referencias a todos los elementos DOM necesarios
     */
    obtenerElementosDOM() {
        return {
            // Navegación
            pestañas: document.querySelectorAll('.tab-btn'),
            contenidoPestañas: document.querySelectorAll('.tab-content'),
            
            // Formulario de insumos
            formInsumo: document.getElementById('form-insumo'),
            nombreInsumo: document.getElementById('nombre-insumo'),
            cantidadInsumo: document.getElementById('cantidad-insumo'),
            unidadInsumo: document.getElementById('unidad-insumo'),
            precioInsumo: document.getElementById('precio-insumo'),
            tablaInsumos: document.getElementById('tabla-insumos'),
            totalInsumos: document.getElementById('total-insumos'),
            
            // Calculadora
            formProducto: document.getElementById('form-producto'),
            nombreProducto: document.getElementById('nombre-producto'),
            cantidadPedido: document.getElementById('cantidad-pedido'),
            formIngrediente: document.getElementById('form-ingrediente'),
            selectInsumo: document.getElementById('select-insumo'),
            cantidadRequerida: document.getElementById('cantidad-requerida'),
            listaIngredientes: document.getElementById('lista-ingredientes'),
            formGasto: document.getElementById('form-gasto'),
            conceptoGasto: document.getElementById('concepto-gasto'),
            costoGasto: document.getElementById('costo-gasto'),
            listaGastos: document.getElementById('lista-gastos'),
            
            // Porcentajes
            porcentajeDesperdicio: document.getElementById('porcentaje-desperdicio'),
            porcentajeCostosFijos: document.getElementById('porcentaje-costos-fijos'),
            porcentajeManoObra: document.getElementById('porcentaje-mano-obra'),
            
            // Resultados
            btnCalcular: document.getElementById('btn-calcular'),
            subtotalIngredientes: document.getElementById('subtotal-ingredientes'),
            totalGastos: document.getElementById('total-gastos'),
            subtotalBase: document.getElementById('subtotal-base'),
            valorDesperdicio: document.getElementById('valor-desperdicio'),
            valorCostosFijos: document.getElementById('valor-costos-fijos'),
            valorManoObra: document.getElementById('valor-mano-obra'),
            costoUnitario: document.getElementById('costo-unitario'),
            totalPedido: document.getElementById('total-pedido'),
            displayDesperdicio: document.getElementById('display-desperdicio'),
            displayCostosFijos: document.getElementById('display-costos-fijos'),
            displayManoObra: document.getElementById('display-mano-obra'),
            displayCantidad: document.getElementById('display-cantidad'),
            tablaDetalleIngredientes: document.getElementById('tabla-detalle-ingredientes'),
            
            // Historial
            btnGuardarCalculo: document.getElementById('btn-guardar-calculo'),
            listaHistorial: document.getElementById('lista-historial'),
            btnLimpiarHistorial: document.getElementById('btn-limpiar-historial'),
            
            // Modal
            modal: document.getElementById('modal-confirmar'),
            modalMensaje: document.getElementById('modal-mensaje'),
            modalCancelar: document.getElementById('modal-cancelar'),
            modalConfirmar: document.getElementById('modal-confirmar-btn')
        };
    }

    /**
     * Configura los eventos de navegación por pestañas
     */
    configurarEventosNavegacion() {
        this.elementos.pestañas.forEach(pestaña => {
            pestaña.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = pestaña.getAttribute('data-tab');
                this.mostrarPestaña(tabId);
            });
        });
    }

    /**
     * Muestra una pestaña específica
     */
    mostrarPestaña(tabId) {
        // Actualizar pestañas activas
        this.elementos.pestañas.forEach(pestaña => {
            pestaña.classList.remove('active');
            if (pestaña.getAttribute('data-tab') === tabId) {
                pestaña.classList.add('active');
            }
        });

        // Actualizar contenido activo
        this.elementos.contenidoPestañas.forEach(contenido => {
            contenido.classList.remove('active');
            if (contenido.id === tabId) {
                contenido.classList.add('active');
            }
        });
    }

    /**
     * Actualiza la tabla de insumos
     */
    actualizarTablaInsumos(insumos) {
        const tbody = this.elementos.tablaInsumos.querySelector('tbody');
        const emptyRow = tbody.querySelector('#empty-insumos');
        
        if (insumos.length === 0) {
            if (emptyRow) emptyRow.style.display = 'table-row';
            tbody.querySelectorAll('tr:not(#empty-insumos)').forEach(row => row.remove());
        } else {
            if (emptyRow) emptyRow.style.display = 'none';
            
            // Limpiar filas existentes
            tbody.querySelectorAll('tr:not(#empty-insumos)').forEach(row => row.remove());
            
            // Añadir nuevas filas
            insumos.forEach(insumo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${insumo.nombre}</td>
                    <td>${insumo.cantidadOriginal} ${this.obtenerNombreUnidad(insumo.unidadOriginal)}</td>
                    <td class="currency">$${insumo.precioTotal.toFixed(2)}</td>
                    <td>${insumo.cantidadConvertida.toFixed(2)} ${insumo.unidadConvertida}</td>
                    <td class="currency">$${insumo.valorPorUnidad.toFixed(4)}</td>
                    <td>
                        <button class="btn-action btn-delete" onclick="controlador.eliminarInsumo(${insumo.id})">
                            🗑️ Eliminar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Actualizar contador
        this.elementos.totalInsumos.textContent = `${insumos.length} insumos`;
    }

    /**
     * Actualiza el dropdown de selección de insumos
     */
    actualizarSelectInsumos(insumos) {
        const select = this.elementos.selectInsumo;
        select.innerHTML = '<option value="">Seleccionar insumo</option>';
        
        insumos.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo.id;
            option.textContent = `${insumo.nombre} (${insumo.unidadConvertida})`;
            select.appendChild(option);
        });
    }

    /**
     * Añade un ingrediente a la lista visual
     */
    añadirIngredienteALista(insumo, cantidad, costo) {
        const div = document.createElement('div');
        div.className = 'ingredient-item';
        div.innerHTML = `
            <div class="ingredient-info">
                <div class="ingredient-name">🧪 ${insumo.nombre}</div>
                <div class="ingredient-details">📊 ${cantidad} ${insumo.unidadConvertida}</div>
            </div>
            <div class="ingredient-cost currency">$${costo.toFixed(2)}</div>
            <button class="btn-action btn-delete" onclick="controlador.eliminarIngrediente(this)" title="Eliminar ingrediente">
                🗑️
            </button>
        `;
        this.elementos.listaIngredientes.appendChild(div);
    }

    /**
     * Añade un gasto a la lista visual
     */
    añadirGastoALista(concepto, costo) {
        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <div class="expense-concept">💡 ${concepto}</div>
            <div class="expense-cost currency">$${costo.toFixed(2)}</div>
            <button class="btn-action btn-delete" onclick="controlador.eliminarGasto(this)" title="Eliminar gasto">
                🗑️
            </button>
        `;
        this.elementos.listaGastos.appendChild(div);
    }

    /**
     * Actualiza la visualización de resultados
     */
    actualizarResultados(resultado) {
        this.elementos.subtotalIngredientes.textContent = `$${resultado.subtotalIngredientes.toFixed(2)}`;
        this.elementos.totalGastos.textContent = `$${resultado.totalGastos.toFixed(2)}`;
        this.elementos.subtotalBase.textContent = `$${resultado.subtotalBase.toFixed(2)}`;
        this.elementos.valorDesperdicio.textContent = `$${resultado.valorDesperdicio.toFixed(2)}`;
        this.elementos.valorCostosFijos.textContent = `$${resultado.valorCostosFijos.toFixed(2)}`;
        this.elementos.valorManoObra.textContent = `$${resultado.valorManoObra.toFixed(2)}`;
        this.elementos.costoUnitario.textContent = `$${resultado.costoUnitarioFinal.toFixed(2)}`;
        this.elementos.totalPedido.textContent = `$${resultado.totalPedido.toFixed(2)}`;
        
        // Actualizar displays de porcentajes
        this.elementos.displayDesperdicio.textContent = resultado.porcentajes.desperdicio;
        this.elementos.displayCostosFijos.textContent = resultado.porcentajes.costosFijos;
        this.elementos.displayManoObra.textContent = resultado.porcentajes.manoObra;
        this.elementos.displayCantidad.textContent = resultado.cantidadPedido;

        // Actualizar tabla de detalle
        this.actualizarTablaDetalleIngredientes(resultado.detalleIngredientes);

        // Añadir efecto visual a los resultados
        this.elementos.totalPedido.closest('.cost-item').classList.add('highlight');
        setTimeout(() => {
            this.elementos.totalPedido.closest('.cost-item').classList.remove('highlight');
        }, 1000);
    }

    /**
     * Actualiza la tabla de detalle de ingredientes
     */
    actualizarTablaDetalleIngredientes(ingredientes) {
        const tbody = this.elementos.tablaDetalleIngredientes.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (ingredientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">🌟 No hay ingredientes añadidos</td></tr>';
        } else {
            ingredientes.forEach(ingrediente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>🧪 ${ingrediente.nombre}</td>
                    <td>📊 ${ingrediente.cantidad.toFixed(2)} ${ingrediente.unidad}</td>
                    <td class="currency">$${ingrediente.precioUnitario.toFixed(4)}</td>
                    <td class="currency">$${ingrediente.total.toFixed(2)}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    /**
     * Actualiza la lista del historial
     */
    actualizarHistorial(historial) {
        const lista = this.elementos.listaHistorial;
        
        if (historial.length === 0) {
            lista.innerHTML = '<div class="empty-state">🎯 No hay cálculos guardados. ¡Realiza tu primer cálculo en la sección "Calculadora de Costos"!</div>';
        } else {
            lista.innerHTML = '';
            
            historial.forEach(calculo => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.innerHTML = `
                    <div class="history-header">
                        <div class="history-title">🎨 ${calculo.nombreProducto}</div>
                        <div class="history-date">📅 ${calculo.fecha.toLocaleDateString()}</div>
                    </div>
                    <div class="history-summary">
                        <div class="history-stat">
                            <span class="history-stat-value">🔢 ${calculo.cantidadPedido}</span>
                            <span class="history-stat-label">Unidades</span>
                        </div>
                        <div class="history-stat">
                            <span class="history-stat-value currency">💎 $${calculo.costoUnitarioFinal.toFixed(2)}</span>
                            <span class="history-stat-label">Costo Unitario</span>
                        </div>
                        <div class="history-stat">
                            <span class="history-stat-value currency">🎯 $${calculo.totalPedido.toFixed(2)}</span>
                            <span class="history-stat-label">Total Pedido</span>
                        </div>
                    </div>
                    <div class="history-actions">
                        <button class="btn btn--outline btn--sm" onclick="controlador.eliminarDelHistorial(${calculo.id})" title="Eliminar del historial">
                            🗑️ Eliminar
                        </button>
                    </div>
                `;
                lista.appendChild(div);
            });
        }
    }

    /**
     * Obtiene el nombre de una unidad por su ID
     */
    obtenerNombreUnidad(id) {
        const unidades = {
            'kg': 'kg', 'g': 'g', 'l': 'l', 'ml': 'ml', 
            'm': 'm', 'cm': 'cm', 'und': 'und'
        };
        return unidades[id] || id;
    }

    /**
     * Muestra un modal de confirmación
     */
    mostrarModalConfirmacion(mensaje, callback) {
        this.elementos.modalMensaje.textContent = mensaje;
        this.elementos.modal.classList.remove('hidden');
        
        const confirmarHandler = () => {
            this.elementos.modal.classList.add('hidden');
            callback();
            this.elementos.modalConfirmar.removeEventListener('click', confirmarHandler);
        };
        
        const cancelarHandler = () => {
            this.elementos.modal.classList.add('hidden');
            this.elementos.modalConfirmar.removeEventListener('click', confirmarHandler);
            this.elementos.modalCancelar.removeEventListener('click', cancelarHandler);
        };
        
        this.elementos.modalConfirmar.addEventListener('click', confirmarHandler);
        this.elementos.modalCancelar.addEventListener('click', cancelarHandler);
    }

    /**
     * Muestra un mensaje de éxito
     */
    mostrarMensajeExito(mensaje) {
        const div = document.createElement('div');
        div.className = 'success-message';
        div.innerHTML = `✨ ${mensaje}`;
        
        const container = document.querySelector('.container');
        container.insertBefore(div, container.firstChild);
        
        setTimeout(() => {
            div.remove();
        }, 4000);
    }

    /**
     * Muestra un mensaje de error
     */
    mostrarMensajeError(mensaje) {
        const div = document.createElement('div');
        div.className = 'error-message';
        div.innerHTML = `⚠️ ${mensaje}`;
        
        const container = document.querySelector('.container');
        container.insertBefore(div, container.firstChild);
        
        setTimeout(() => {
            div.remove();
        }, 4000);
    }

    /**
     * Limpiar formularios
     */
    limpiarFormularioInsumo() {
        this.elementos.formInsumo.reset();
    }

    limpiarFormularioIngrediente() {
        this.elementos.selectInsumo.selectedIndex = 0;
        this.elementos.cantidadRequerida.value = '';
    }

    limpiarFormularioGasto() {
        this.elementos.conceptoGasto.value = '';
        this.elementos.costoGasto.value = '';
    }

    limpiarListaIngredientes() {
        this.elementos.listaIngredientes.innerHTML = '';
    }

    limpiarListaGastos() {
        this.elementos.listaGastos.innerHTML = '';
    }
}

/**
 * CONTROLADOR - Coordinación entre Modelo y Vista
 */
class ControladorCalculadora {
    constructor() {
        this.modelo = new ModeloCalculadora();
        this.vista = new VistaCalculadora();
        this.ingredientesActuales = [];
        this.gastosActuales = [];
        this.inicializar();
    }

    /**
     * Inicializa la aplicación
     */
    inicializar() {
        this.configurarEventos();
        // Mostrar la pestaña de insumos por defecto
        this.vista.mostrarPestaña('insumos');
        this.actualizarVistaInsumos();
        this.actualizarDisplayPorcentajes();
        this.vista.actualizarHistorial(this.modelo.obtenerHistorial());
    }

    /**
     * Configura todos los eventos de la aplicación
     */
    configurarEventos() {
        // Eventos del formulario de insumos
        this.vista.elementos.formInsumo.addEventListener('submit', (e) => {
            e.preventDefault();
            this.manejarFormularioInsumo();
        });

        // Eventos del formulario de ingredientes
        this.vista.elementos.formIngrediente.addEventListener('submit', (e) => {
            e.preventDefault();
            this.manejarFormularioIngrediente();
        });

        // Eventos del formulario de gastos
        this.vista.elementos.formGasto.addEventListener('submit', (e) => {
            e.preventDefault();
            this.manejarFormularioGasto();
        });

        // Evento de cálculo
        this.vista.elementos.btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();
            this.realizarCalculo();
        });

        // Evento de guardar cálculo
        this.vista.elementos.btnGuardarCalculo.addEventListener('click', (e) => {
            e.preventDefault();
            this.guardarCalculo();
        });

        // Evento de limpiar historial
        this.vista.elementos.btnLimpiarHistorial.addEventListener('click', (e) => {
            e.preventDefault();
            this.limpiarHistorial();
        });

        // Eventos de porcentajes en tiempo real
        [this.vista.elementos.porcentajeDesperdicio, 
         this.vista.elementos.porcentajeCostosFijos, 
         this.vista.elementos.porcentajeManoObra,
         this.vista.elementos.cantidadPedido].forEach(elemento => {
            if (elemento) {
                elemento.addEventListener('input', () => {
                    this.actualizarDisplayPorcentajes();
                });
            }
        });
    }

    /**
     * Maneja el formulario de añadir insumos
     */
    manejarFormularioInsumo() {
        const nombre = this.vista.elementos.nombreInsumo.value;
        const cantidad = parseFloat(this.vista.elementos.cantidadInsumo.value);
        const unidad = this.vista.elementos.unidadInsumo.value;
        const precio = parseFloat(this.vista.elementos.precioInsumo.value);

        if (this.validarFormularioInsumo(nombre, cantidad, unidad, precio)) {
            const insumo = this.modelo.añadirInsumo(nombre, cantidad, unidad, precio);
            this.actualizarVistaInsumos();
            this.vista.limpiarFormularioInsumo();
            this.vista.mostrarMensajeExito(`Insumo "${nombre}" añadido correctamente`);
        }
    }

    /**
     * Maneja el formulario de añadir ingredientes
     */
    manejarFormularioIngrediente() {
        const insumoId = this.vista.elementos.selectInsumo.value;
        const cantidad = parseFloat(this.vista.elementos.cantidadRequerida.value);

        if (this.validarFormularioIngrediente(insumoId, cantidad)) {
            const insumo = this.modelo.obtenerInsumo(insumoId);
            const costo = this.modelo.calcularCostoIngrediente(insumoId, cantidad);
            
            this.ingredientesActuales.push({
                insumoId: parseInt(insumoId),
                cantidad: cantidad
            });

            this.vista.añadirIngredienteALista(insumo, cantidad, costo);
            this.vista.limpiarFormularioIngrediente();
        }
    }

    /**
     * Maneja el formulario de añadir gastos
     */
    manejarFormularioGasto() {
        const concepto = this.vista.elementos.conceptoGasto.value.trim();
        const costo = parseFloat(this.vista.elementos.costoGasto.value);

        if (this.validarFormularioGasto(concepto, costo)) {
            this.gastosActuales.push({
                concepto: concepto,
                costo: costo
            });

            this.vista.añadirGastoALista(concepto, costo);
            this.vista.limpiarFormularioGasto();
        }
    }

    /**
     * Realiza el cálculo de costos
     */
    realizarCalculo() {
        const nombre = this.vista.elementos.nombreProducto.value.trim();
        const cantidadPedido = parseInt(this.vista.elementos.cantidadPedido.value);
        const porcentajeDesperdicio = parseFloat(this.vista.elementos.porcentajeDesperdicio.value);
        const porcentajeCostosFijos = parseFloat(this.vista.elementos.porcentajeCostosFijos.value);
        const porcentajeManoObra = parseFloat(this.vista.elementos.porcentajeManoObra.value);

        if (this.validarCalculo(nombre, cantidadPedido, this.ingredientesActuales)) {
            const datosProducto = {
                nombre,
                cantidadPedido,
                ingredientes: this.ingredientesActuales,
                gastos: this.gastosActuales,
                porcentajeDesperdicio,
                porcentajeCostosFijos,
                porcentajeManoObra
            };

            const resultado = this.modelo.calcularCostos(datosProducto);
            this.vista.actualizarResultados(resultado);
            this.vista.mostrarMensajeExito('¡Cálculo realizado correctamente!');
        }
    }

    /**
     * Guarda el cálculo actual en el historial
     */
    guardarCalculo() {
        if (this.modelo.calculoActual) {
            this.modelo.guardarCalculoEnHistorial();
            this.vista.actualizarHistorial(this.modelo.obtenerHistorial());
            this.vista.mostrarMensajeExito('¡Cálculo guardado en el historial!');
        } else {
            this.vista.mostrarMensajeError('Primero debes realizar un cálculo');
        }
    }

    /**
     * Elimina un insumo
     */
    eliminarInsumo(id) {
        this.vista.mostrarModalConfirmacion(
            '¿Estás seguro de que deseas eliminar este insumo?',
            () => {
                this.modelo.eliminarInsumo(id);
                this.actualizarVistaInsumos();
                this.vista.mostrarMensajeExito('Insumo eliminado correctamente');
            }
        );
    }

    /**
     * Elimina un ingrediente de la lista actual
     */
    eliminarIngrediente(elemento) {
        const item = elemento.closest('.ingredient-item');
        const index = Array.from(item.parentNode.children).indexOf(item);
        
        this.ingredientesActuales.splice(index, 1);
        item.remove();
    }

    /**
     * Elimina un gasto de la lista actual
     */
    eliminarGasto(elemento) {
        const item = elemento.closest('.expense-item');
        const index = Array.from(item.parentNode.children).indexOf(item);
        
        this.gastosActuales.splice(index, 1);
        item.remove();
    }

    /**
     * Elimina un cálculo del historial
     */
    eliminarDelHistorial(id) {
        this.vista.mostrarModalConfirmacion(
            '¿Estás seguro de que deseas eliminar este cálculo del historial?',
            () => {
                this.modelo.eliminarDelHistorial(id);
                this.vista.actualizarHistorial(this.modelo.obtenerHistorial());
            }
        );
    }

    /**
     * Limpia todo el historial
     */
    limpiarHistorial() {
        this.vista.mostrarModalConfirmacion(
            '¿Estás seguro de que deseas limpiar todo el historial?',
            () => {
                this.modelo.limpiarHistorial();
                this.vista.actualizarHistorial(this.modelo.obtenerHistorial());
            }
        );
    }

    /**
     * Actualiza la vista de insumos
     */
    actualizarVistaInsumos() {
        const insumos = this.modelo.obtenerInsumos();
        this.vista.actualizarTablaInsumos(insumos);
        this.vista.actualizarSelectInsumos(insumos);
    }

    /**
     * Actualiza los displays de porcentajes en tiempo real
     */
    actualizarDisplayPorcentajes() {
        const desperdicio = this.vista.elementos.porcentajeDesperdicio.value || 10;
        const costosFijos = this.vista.elementos.porcentajeCostosFijos.value || 20;
        const manoObra = this.vista.elementos.porcentajeManoObra.value || 50;
        const cantidad = this.vista.elementos.cantidadPedido.value || 1;

        if (this.vista.elementos.displayDesperdicio) {
            this.vista.elementos.displayDesperdicio.textContent = desperdicio;
        }
        if (this.vista.elementos.displayCostosFijos) {
            this.vista.elementos.displayCostosFijos.textContent = costosFijos;
        }
        if (this.vista.elementos.displayManoObra) {
            this.vista.elementos.displayManoObra.textContent = manoObra;
        }
        if (this.vista.elementos.displayCantidad) {
            this.vista.elementos.displayCantidad.textContent = cantidad;
        }
    }

    // MÉTODOS DE VALIDACIÓN

    validarFormularioInsumo(nombre, cantidad, unidad, precio) {
        if (!nombre || nombre.length < 2) {
            this.vista.mostrarMensajeError('El nombre del insumo debe tener al menos 2 caracteres');
            return false;
        }
        if (!cantidad || cantidad <= 0) {
            this.vista.mostrarMensajeError('La cantidad debe ser mayor a 0');
            return false;
        }
        if (!unidad) {
            this.vista.mostrarMensajeError('Debes seleccionar una unidad de medida');
            return false;
        }
        if (!precio || precio <= 0) {
            this.vista.mostrarMensajeError('El precio debe ser mayor a 0');
            return false;
        }
        return true;
    }

    validarFormularioIngrediente(insumoId, cantidad) {
        if (!insumoId) {
            this.vista.mostrarMensajeError('Debes seleccionar un insumo');
            return false;
        }
        if (!cantidad || cantidad <= 0) {
            this.vista.mostrarMensajeError('La cantidad requerida debe ser mayor a 0');
            return false;
        }
        return true;
    }

    validarFormularioGasto(concepto, costo) {
        if (!concepto || concepto.length < 2) {
            this.vista.mostrarMensajeError('El concepto del gasto debe tener al menos 2 caracteres');
            return false;
        }
        if (!costo || costo <= 0) {
            this.vista.mostrarMensajeError('El costo debe ser mayor a 0');
            return false;
        }
        return true;
    }

    validarCalculo(nombre, cantidadPedido, ingredientes) {
        if (!nombre || nombre.length < 2) {
            this.vista.mostrarMensajeError('El nombre del producto debe tener al menos 2 caracteres');
            return false;
        }
        if (!cantidadPedido || cantidadPedido <= 0) {
            this.vista.mostrarMensajeError('La cantidad del pedido debe ser mayor a 0');
            return false;
        }
        if (ingredientes.length === 0) {
            this.vista.mostrarMensajeError('Debes añadir al menos un ingrediente');
            return false;
        }
        return true;
    }
}

// Inicialización de la aplicación
let controlador;

document.addEventListener('DOMContentLoaded', () => {
    controlador = new ControladorCalculadora();
    console.log('🚀 Calculadora de Costos inicializada correctamente');
});