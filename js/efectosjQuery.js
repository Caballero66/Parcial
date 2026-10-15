const pacienteActual = {
    nombre: "",
    genero: "",
    edad: 0,
    temperatura: 0,
    frecuenciaCardiaca: 0,
    presionSistolica: 0,
    presionDiastolica: 0,
    sintomas: []
};

let pacientesEnSala = JSON.parse(localStorage.getItem('pacientes')) || [];

function inicializarEventosBase() {
    $('#btnIniciarEvaluacion').on('click', () => mostrarVista('vistaFormularioPersonales'));
    $('#btnVerPacientes').on('click', prepararSalaEspera);
    $('#navInicio, #btnVolverInicio').on('click', () => mostrarVista('vistaLanding'));
    $('#btnSalirFormulario').on('click', cancelarRegistro);
    $('#btnSiguientePaso').on('click', validarAvanzarPasoUno);
    $('#btnAnteriorPaso').on('click', () => mostrarVista('vistaFormularioPersonales'));
    $('#btnEvaluarGuardar').on('click', procesarEvaluacionFinal);
}

function inicializarBuscadorSintomas() {
    $('#inputBuscarSintoma').on('input', ejecutarBusquedaSintomas);
    $(document).on('click', limpiarSugerenciasClicAfuera);
}

function mostrarVista(idVistaObjetivo) {
    $('.vista-seccion').addClass('d-none');$(`#${idVistaObjetivo}`).removeClass('d-none');
}

function cancelarRegistro() {
    limpiarFormulariosGenerales();
    mostrarVista('vistaLanding');
}

function prepararSalaEspera() {
    renderizarTablaPacientes();
    mostrarVista('vistaDashboard');
}

function validarAvanzarPasoUno() {
    const elementoFormulario = $('#formularioPersonales')[0];
    
    if (!elementoFormulario.checkValidity()) {
        elementoFormulario.reportValidity();
        return;
    }
    
    capturarDatosPersonales();
    mostrarVista('vistaFormularioSintomas');
}

function capturarDatosPersonales() {
    pacienteActual.nombre = $('#inputNombre').val().trim();
    pacienteActual.genero = $('#selectGenero').val();
    pacienteActual.edad = parseInt($('#inputEdad').val(), 10);
    pacienteActual.temperatura = parseFloat($('#inputTemperatura').val());
    pacienteActual.frecuenciaCardiaca = parseInt($('#inputFrecuencia').val(), 10);
    pacienteActual.presionSistolica = parseInt($('#inputSistolica').val(), 10);
    pacienteActual.presionDiastolica = parseInt($('#inputDiastolica').val(), 10);
}

function ejecutarBusquedaSintomas() {
    const terminoBusqueda = $(this).val().toLowerCase().trim();
    const cajaSugerencias = $('#contenedorSugerencias');
    cajaSugerencias.empty();

    if (terminoBusqueda.length < 2) {
        cajaSugerencias.addClass('d-none');
        return;
    }

    const coincidenciasEncontradas = catalogoSintomas.filter(sintoma => 
        sintoma.nombre.toLowerCase().includes(terminoBusqueda) && 
        !pacienteActual.sintomas.includes(sintoma.id)
    );

    renderizarSugerencias(coincidenciasEncontradas, cajaSugerencias);
}

function renderizarSugerencias(resultados, contenedorDestino) {
    if (resultados.length > 0) {
        contenedorDestino.removeClass('d-none');
        resultados.forEach(sintoma => {
            const nodoLista = $('<a>', {
                class: 'list-group-item list-group-item-action fw-medium cursor-pointer',
                text: sintoma.nombre,
                click: () => confirmarSintomaPaciente(sintoma)
            });
            contenedorDestino.append(nodoLista);
        });
    } else {
        contenedorDestino.addClass('d-none');
    }
}

function limpiarSugerenciasClicAfuera(evento) {
    if (!$(evento.target).closest('.position-relative').length) {$('#contenedorSugerencias').addClass('d-none');
    }
}

function confirmarSintomaPaciente(objetoSintoma) {
    pacienteActual.sintomas.push(objetoSintoma.id);
    $('#inputBuscarSintoma').val('');
    $('#contenedorSugerencias').addClass('d-none');
    renderizarCuadriculaSintomas();
}

function eliminarSintomaPaciente(idSintomaObjetivo) {
    pacienteActual.sintomas = pacienteActual.sintomas.filter(id => id !== idSintomaObjetivo);
    renderizarCuadriculaSintomas();
}

function renderizarCuadriculaSintomas() {
    const contenedorPrincipal = $('#contenedorSintomasSeleccionados');
    contenedorPrincipal.empty();

    pacienteActual.sintomas.forEach(idIterado => {
        const informacionSintoma = catalogoSintomas.find(item => item.id === idIterado);
        const claseEtiquetaColor = obtenerColorGravedadCss(informacionSintoma.categoria);
        
        const maquetaTarjeta = `
            <div class="col-md-6">
                <div class="tarjeta-sintoma">
                    <img src="${informacionSintoma.imagen}" class="icono-sintoma" onerror="this.src='https://i.pinimg.com/474x/31/77/c4/3177c447da6c493e18e3a9cc0d737527.jpg'">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 text-truncate">${informacionSintoma.nombre}</h6>
                        <span class="badge ${claseEtiquetaColor} text-white">Nivel: ${informacionSintoma.categoria.toUpperCase()}</span>
                    </div>
                    <button type="button" class="btn-close ms-auto" onclick="eliminarSintomaPaciente(${informacionSintoma.id})"></button>
                </div>
            </div>
        `;
        contenedorPrincipal.append(maquetaTarjeta);
    });
}

function obtenerColorGravedadCss(escalaGravedad) {
    if (escalaGravedad === 'leve') return 'bg-success';
    if (escalaGravedad === 'grave') return 'bg-warning text-dark';
    return 'bg-danger';
}

function procesarEvaluacionFinal() {
    limpiarErroresVisuales();
    
    if (pacienteActual.sintomas.length === 0) {
        $('#errorSintomas').removeClass('d-none').text("Debe seleccionar al menos un síntoma para continuar.");
        return;
    }

    const dictamenMedico = calcularNivelEmergencia(pacienteActual);
    
    pacienteActual.nivelPrioridad = dictamenMedico.nivel;
    pacienteActual.puntajeTotal = dictamenMedico.puntajeTotal;
    pacienteActual.alertas = dictamenMedico.alertas;
    pacienteActual.marcaTiempoCreacion = new Date().getTime();

    guardarPacienteEnMemoria();
    limpiarFormulariosGenerales();
    prepararSalaEspera();
}

function guardarPacienteEnMemoria() {
    pacientesEnSala.push({...pacienteActual});
    localStorage.setItem('pacientes', JSON.stringify(pacientesEnSala));
}

function renderizarTablaPacientes() {
    const cuerpoTablaDom = $('#cuerpoTablaPacientes');
    cuerpoTablaDom.empty();

    const listaOrdenada = organizarArregloPrioridad();

    listaOrdenada.forEach(pacienteIterado => {
        const colorEstadoFila = definirFondoPrioridadFila(pacienteIterado.nivelPrioridad);
        const htmlEtiquetasAlertas = pacienteIterado.alertas.map(alerta => 
            `<span class="badge bg-secondary border border-light me-1">${alerta}</span>`
        ).join('');

        const bloqueFilaHtml = `
            <tr>
                <td class="fw-bold">${pacienteIterado.nombre}</td>
                <td>${pacienteIterado.edad}</td>
                <td><span class="badge ${colorEstadoFila} fs-6">${pacienteIterado.nivelPrioridad}</span></td>
                <td>${htmlEtiquetasAlertas || '<span class="text-muted fst-italic">Sin alertas vitales</span>'}</td>
            </tr>
        `;
        cuerpoTablaDom.append(bloqueFilaHtml);
    });
}

function organizarArregloPrioridad() {
    return [...pacientesEnSala].sort((a, b) => {
        if (b.puntajeTotal !== a.puntajeTotal) {
            return b.puntajeTotal - a.puntajeTotal;
        }
        return a.marcaTiempoCreacion - b.marcaTiempoCreacion;
    });
}

function definirFondoPrioridadFila(etiquetaPrioridad) {
    if (etiquetaPrioridad === 'Emergencia Máxima') return 'bg-danger';
    if (etiquetaPrioridad === 'Urgencia Alta') return 'bg-warning text-dark';
    if (etiquetaPrioridad === 'Urgencia Moderada') return 'bg-primary';
    return 'bg-success';
}

function limpiarFormulariosGenerales() {
    $('#formularioPersonales')[0].reset();
    pacienteActual.sintomas = [];
    renderizarCuadriculaSintomas();
}

function renderizarCuadriculaSintomas() {
    const contenedorPrincipal = $('#contenedorSintomasSeleccionados');
    contenedorPrincipal.empty();

    pacienteActual.sintomas.forEach(idIterado => {
        const informacionSintoma = catalogoSintomas.find(item => item.id === idIterado);
        const claseEtiquetaColor = obtenerColorGravedadCss(informacionSintoma.categoria);
        
        const bordeSegunCategoria = 
            informacionSintoma.categoria === 'leve' ? 'borde-leve' : 
            informacionSintoma.categoria === 'grave' ? 'borde-grave' : 'borde-extremo';
        
        const maquetaTarjeta = `
            <div class="col-md-6">
                <div class="tarjeta-sintoma ${bordeSegunCategoria}">
                    <img src="${informacionSintoma.imagen}" class="icono-sintoma" onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTymujOlaWcm8sA4KzpXnBWN1AIoiL3_YnRCLP0FJu3GkQSdcRpE-HfpsU&s=10'">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 text-truncate font-bold">${informacionSintoma.nombre}</h6>
                        <span class="badge ${claseEtiquetaColor}">NIVEL: ${informacionSintoma.categoria.toUpperCase()}</span>
                    </div>
                    <button type="button" class="btn-close btn-close-white ms-auto" onclick="eliminarSintomaPaciente(${informacionSintoma.id})"></button>
                </div>
            </div>
        `;
        contenedorPrincipal.append(maquetaTarjeta);
    });
}

function organizarArregloPrioridad() {
    return [...pacientesEnSala].sort((a, b) => {
        if (b.puntajeTotal !== a.puntajeTotal) {
            return b.puntajeTotal - a.puntajeTotal;
        }
        return a.marcaTiempoCreacion - b.marcaTiempoCreacion;
    });
}

function definirFondoPrioridadFila(etiquetaPrioridad) {
    if (etiquetaPrioridad === 'Emergencia Máxima') return 'bg-danger';
    if (etiquetaPrioridad === 'Urgencia Alta') return 'bg-warning text-dark';
    if (etiquetaPrioridad === 'Urgencia Moderada') return 'bg-primary';
    return 'bg-success';
}

$(document).ready(() => {
    inicializarEventosBase();
    inicializarBuscadorSintomas();
});

function mostrarErroresVisuales(errores) {
    const mapaCampos = {
        nombre: 'inputNombre',
        edad: 'inputEdad',
        temperatura: 'inputTemperatura',
        frecuencia: 'inputFrecuencia'
    };

    for (const propiedad in errores) {
        if (propiedad === 'presion') {
            $('#inputSistolica, #inputDiastolica').addClass('is-invalid');
            $('#errorPresion').text(errores[propiedad]).show();
        } else {
            const idCampo = mapaCampos[propiedad];
            $(`#${idCampo}`).addClass('is-invalid');
            $(`#error${propiedad.charAt(0).toUpperCase() + propiedad.slice(1)}`).text(errores[propiedad]);
        }
    }
}

function limpiarErroresVisuales() {
    $('.form-control, .form-select').removeClass('is-invalid');
    $('.invalid-feedback').text('');$('#errorSintomas').addClass('d-none').text('');
}

function validarAvanzarPasoUno() {
    limpiarErroresVisuales();
    
    const datosTemporales = {
        nombre: $('#inputNombre').val().trim(),
        edad: parseInt($('#inputEdad').val(), 10),
        temperatura: parseFloat($('#inputTemperatura').val()),
        frecuenciaCardiaca: parseInt($('#inputFrecuencia').val(), 10),
        presionSistolica: parseInt($('#inputSistolica').val(), 10),
        presionDiastolica: parseInt($('#inputDiastolica').val(), 10)
    };

    const erroresEncontrados = validarFasePersonales(datosTemporales);
    
    if (Object.keys(erroresEncontrados).length > 0) {
        mostrarErroresVisuales(erroresEncontrados);
        return;
    }
    
    capturarDatosPersonales();
    mostrarVista('vistaFormularioSintomas');
}