'use strict';

let eventoInstalacionDiferido = null;
let streamActual = null;
let modoCamaraActual = 'environment';

function actualizarMensajeEstado(mensaje) {
  document.getElementById('estado').textContent = mensaje;
}

function verificarEntornoIOS() {
  const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const estaInstalada = window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;

  if (esIOS && !estaInstalada) {
    const guiaIOS = document.getElementById('instrucciones-ios');
    if (guiaIOS) {
      guiaIOS.hidden = false;
    }
  }
}

function detenerCamaraActiva() {
  if (streamActual) {
    streamActual.getTracks().forEach((track) => {
      track.stop();
    });
    streamActual = null;
  }

  const visorVideo = document.getElementById('visor-camara');
  if (visorVideo.srcObject) {
    visorVideo.srcObject = null;
  }
}

function iniciarCamara(modo) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    actualizarMensajeEstado('Este navegador no permite acceso a la cámara. Comprueba que la página se sirva por HTTPS.');
    return Promise.resolve(false);
  }

  detenerCamaraActiva();
  actualizarMensajeEstado('Solicitando acceso al sensor de cámara...');

  const restricciones = {
    video: { facingMode: modo },
    audio: false
  };

  return navigator.mediaDevices.getUserMedia(restricciones)
    .then((stream) => {
      streamActual = stream;
      const visorVideo = document.getElementById('visor-camara');
      visorVideo.srcObject = stream;
      actualizarMensajeEstado('Cámara activa (' + (modo === 'environment' ? 'Trasera' : 'Frontal') + ')');
      return true;
    })
    .catch((error) => {
      if (error.name === 'NotAllowedError') {
        actualizarMensajeEstado('Permiso denegado. Habilita el acceso a la cámara en los ajustes de tu navegador.');
      } else if (error.name === 'NotFoundError') {
        actualizarMensajeEstado('No se detectó el sensor de cámara solicitado en este dispositivo.');
      } else {
        actualizarMensajeEstado('Error al acceder al hardware: ' + error.message);
      }
      return false;
    })
    .finally(() => {
      const camaraActiva = Boolean(streamActual);
      document.getElementById('btn-alternar-camara').disabled = !camaraActiva;
      document.getElementById('btn-apagar-camara').disabled = !camaraActiva;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  verificarEntornoIOS();

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    eventoInstalacionDiferido = event;
    document.getElementById('btn-instalar').hidden = false;
  });

  document.getElementById('btn-instalar').addEventListener('click', () => {
    if (!eventoInstalacionDiferido) {
      return;
    }

    eventoInstalacionDiferido.prompt();
    eventoInstalacionDiferido.userChoice
      .then((resultado) => {
        if (resultado.outcome === 'accepted') {
          actualizarMensajeEstado('Aplicación instalada en la pantalla de inicio.');
        } else {
          actualizarMensajeEstado('Instalación cancelada. Puedes volver a intentarlo más tarde.');
        }
      })
      .catch(() => {
        actualizarMensajeEstado('No se pudo completar la instalación.');
      })
      .finally(() => {
        eventoInstalacionDiferido = null;
        document.getElementById('btn-instalar').hidden = true;
      });
  });

  document.getElementById('btn-preparar-camara').addEventListener('click', () => {
    document.getElementById('aviso-permiso').hidden = false;
  });

  document.getElementById('btn-confirmar-permiso').addEventListener('click', () => {
    document.getElementById('aviso-permiso').hidden = true;
    iniciarCamara(modoCamaraActual);
  });

  document.getElementById('btn-alternar-camara').addEventListener('click', () => {
    modoCamaraActual = modoCamaraActual === 'environment' ? 'user' : 'environment';
    iniciarCamara(modoCamaraActual);
  });

  document.getElementById('btn-apagar-camara').addEventListener('click', () => {
    detenerCamaraActiva();
    document.getElementById('btn-alternar-camara').disabled = true;
    document.getElementById('btn-apagar-camara').disabled = true;
    actualizarMensajeEstado('Cámara apagada. El sensor se ha liberado correctamente.');
  });

  window.addEventListener('pagehide', detenerCamaraActiva);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(() => {
          actualizarMensajeEstado('Aplicación lista para funcionar sin conexión.');
        })
        .catch(() => {
          actualizarMensajeEstado('No se pudo registrar el service worker.');
        });
    });
  }
});
