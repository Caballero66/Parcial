const catalogoSintomas = [
  {
    id: 1,
    nombre: "Dolor de cabeza",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 2,
    nombre: "Tos seca",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 3,
    nombre: "Cansancio",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 4,
    nombre: "Dolor de garganta",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 5,
    nombre: "Congestion nasal",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 6,
    nombre: "Nauseas",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 7,
    nombre: "Mareo",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 8,
    nombre: "Dolor muscular",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 9,
    nombre: "Erupcion cutanea",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },
  {
    id: 10,
    nombre: "Picor ocular",
    categoria: "leve",
    sumaUrgencia: 1,
    imagen: "",
  },

  {
    id: 11,
    nombre: "Dolor abdominal agudo",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 12,
    nombre: "Dificultad respiratoria",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 13,
    nombre: "Hemorragia nasal persistente",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 14,
    nombre: "Deshidratacion",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 15,
    nombre: "Fiebre prolongada",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 16,
    nombre: "Sangrado moderado",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 17,
    nombre: "Confusion",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 18,
    nombre: "Debilidad motora",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 19,
    nombre: "Alteracion visual",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },
  {
    id: 20,
    nombre: "Dolor articular severo",
    categoria: "grave",
    sumaUrgencia: 10,
    imagen: "",
  },

  {
    id: 21,
    nombre: "Paro cardiorrespiratorio",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 22,
    nombre: "Hemorragia severa",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 23,
    nombre: "Perdida de consciencia",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 24,
    nombre: "Dolor toracico opresivo",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 25,
    nombre: "Asfixia",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 26,
    nombre: "Convulsiones activas",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 27,
    nombre: "Traumatismo craneal grave",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 28,
    nombre: "Quemaduras extensas",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 29,
    nombre: "Anafilaxia",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
  {
    id: 30,
    nombre: "Amputacion",
    categoria: "extremo",
    sumaUrgencia: 1000,
    imagen: "",
  },
];

function evaluarTemperatura(temperatura) {
    if (temperatura > 40.0 || temperatura < 35.0) {
        return { puntaje: 1000, alerta: "Temperatura crítica" };
    }
    if (temperatura >= 39.0 && temperatura <= 40.0) {
        return { puntaje: 100, alerta: "Fiebre alta" };
    }
    if (temperatura >= 38.0 && temperatura < 39.0) {
        return { puntaje: 10, alerta: "Fiebre moderada" };
    }
    return { puntaje: 0, alerta: null };
}

function evaluarFrecuenciaCardiaca(frecuencia) {
    if (frecuencia > 150) {
        return { puntaje: 1000, alerta: "Taquicardia severa" };
    }
    if (frecuencia < 40) {
        return { puntaje: 1000, alerta: "Bradicardia severa" };
    }
    if (frecuencia >= 110 && frecuencia <= 150) {
        return { puntaje: 100, alerta: "Taquicardia alta" };
    }
    if (frecuencia >= 40 && frecuencia <= 59) {
        return { puntaje: 100, alerta: "Bradicardia alta" };
    }
    if (frecuencia >= 100 && frecuencia < 110) {
        return { puntaje: 10, alerta: "Taquicardia leve" };
    }
    return { puntaje: 0, alerta: null };
}

function evaluarEdad(edad) {
    if (edad > 60) {
        return { puntaje: 10, alerta: "Paciente de tercera edad" };
    }
    return { puntaje: 0, alerta: null };
}

function evaluarSintomas(idsSintomasRecibidos) {
    let puntajeSintomas = 0;
    let acumuladoLeves = 0;
    const alertasSintomas = [];

    idsSintomasRecibidos.forEach(id => {
        const sintoma = catalogoSintomas.find(item => item.id === id);
        
        if (sintoma) {
            if (sintoma.categoria === "leve") {
                acumuladoLeves += sintoma.sumaUrgencia;
            } else {
                puntajeSintomas += sintoma.sumaUrgencia;
            }

            if (sintoma.categoria === "extremo") {
                alertasSintomas.push(`Síntoma crítico: ${sintoma.nombre}`);
            }
        }
    });

    puntajeSintomas += Math.min(acumuladoLeves, 3);

    return { puntaje: puntajeSintomas, alertas: alertasSintomas };
}

function determinarNivelPrioridad(puntajeTotal) {
    if (puntajeTotal >= 1000) return "Emergencia Máxima";
    if (puntajeTotal >= 100) return "Urgencia Alta";
    if (puntajeTotal >= 10) return "Urgencia Moderada";
    return "Urgencia Leve";
}

function calcularNivelEmergencia(paciente) {
    const evaluacionTemperatura = evaluarTemperatura(paciente.temperatura);
    const evaluacionFrecuencia = evaluarFrecuenciaCardiaca(paciente.frecuenciaCardiaca);
    const evaluacionEdad = evaluarEdad(paciente.edad);
    const evaluacionSintomas = evaluarSintomas(paciente.sintomas);

    const puntajeFinal = evaluacionTemperatura.puntaje + evaluacionFrecuencia.puntaje + evaluacionEdad.puntaje + evaluacionSintomas.puntaje;

    const alertasGeneradas = [evaluacionTemperatura.alerta,evaluacionFrecuencia.alerta,evaluacionEdad.alerta,...evaluacionSintomas.alertas
    ].filter(alerta => alerta !== null);

    const nivelPrioridad = determinarNivelPrioridad(puntajeFinal);

    return {
        nivel: nivelPrioridad,
        puntajeTotal: puntajeFinal,
        alertas: alertasGeneradas
    };
}

function esNombreValido(nombre) {
    return typeof nombre === 'string' && nombre.trim().length > 0;
}

function esEdadValida(edad) {
    return Number.isInteger(edad) && edad >= 0 && edad <= 120;
}

function esTemperaturaValida(temperatura) {
    return typeof temperatura === 'number' && temperatura >= 25.0 && temperatura <= 45.0;
}

function esFrecuenciaCardiacaValida(frecuencia) {
    return Number.isInteger(frecuencia) && frecuencia >= 0 && frecuencia <= 300;
}

function sonSintomasValidos(sintomas) {
    return Array.isArray(sintomas) && sintomas.length > 0;
}

function validarDatosPaciente(paciente) {
    const errores = [];

    if (!esNombreValido(paciente.nombre)) {
        errores.push("Nombre inválido");
    }
    if (!esEdadValida(paciente.edad)) {
        errores.push("Edad invalida");
    }
    if (!esTemperaturaValida(paciente.temperatura)) {
        errores.push("Temperatura fuera de rango natural");
    }
    if (!esFrecuenciaCardiacaValida(paciente.frecuenciaCardiaca)) {
        errores.push("Frecuencia cardíaca fuera de rango natural");
    }
    if (!sonSintomasValidos(paciente.sintomas)) {
        errores.push("Debe seleccionar al menos un síntoma");
    }

    return {
        esValido: errores.length === 0,
        errores: errores
    };
}