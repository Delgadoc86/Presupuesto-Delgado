// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Obtiene referencias a los elementos del DOM
    let botonGenerarPresupuesto = document.getElementById('generar-presupuesto');
    let nombreClienteInput = document.getElementById('nombre-cliente');
    let telefonoInput = document.getElementById('telefono');  
    let manoObraInput = document.getElementById('mano-obra');
    let repuestosInput = document.getElementById('repuestos');
    let resultadoDiv = document.getElementById('resultado');
    let historialPresupuestos = document.getElementById('historial-presupuestos').getElementsByTagName('tbody')[0];

    // Calcula el total del presupuesto sumando mano de obra y repuestos
    function calcularPresupuesto(manoObra, repuestos) {
        return manoObra + repuestos;
    }

    // Genera un presupuesto y lo muestra en la interfaz
    function generarPresupuesto() {
        let nombreCliente = nombreClienteInput.value.trim();
        let telefono = telefonoInput.value.trim();  
        let manoObra = parseFloat(manoObraInput.value.trim());
        let repuestos = parseFloat(repuestosInput.value.trim());

        // Validación de entradas
        if (nombreCliente === '' || telefono === '' || isNaN(manoObra) || isNaN(repuestos)) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        // Calcula el total y muestra el resultado
        let total = calcularPresupuesto(manoObra, repuestos);
        resultadoDiv.innerHTML = '<h3>Presupuesto para: ' + nombreCliente + '</h3>' +
                                 '<h3>Teléfono: ' + telefono + '</h3>' +  
                                 '<p>Mano de obra: $' + manoObra + '</p>' +
                                 '<p>Repuestos: $' + repuestos + '</p>' +
                                 '<p><strong>Total: $' + total + '</strong></p>';

        // Guarda el presupuesto en el historial y en localStorage
        guardarPresupuestoEnHistorial(nombreCliente, telefono, manoObra, repuestos, total);
        guardarEnStorage(nombreCliente, telefono, manoObra, repuestos, total);

        // Limpia los campos del formulario
        limpiarCampos();

        // Muestra mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: 'Presupuesto Generado',
            text: 'El presupuesto se ha generado correctamente.',
        });
    }

    // Agrega un presupuesto al historial visual en la tabla
    function guardarPresupuestoEnHistorial(cliente, telefono, manoObra, repuestos, total) {
        let nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = '<td>' + cliente + '</td>' +
                              '<td>' + telefono + '</td>' + 
                              '<td>$' + manoObra + '</td>' +
                              '<td>$' + repuestos + '</td>' +
                              '<td>$' + total + '</td>' +
                              '<td>' +
                              '<button class="btn-editar">Editar</button>' +
                              '<button class="btn-eliminar">Eliminar</button>' +
                              '</td>';
        historialPresupuestos.appendChild(nuevaFila);

        // Animación de aparición
        nuevaFila.style.opacity = 0;
        setTimeout(() => nuevaFila.style.opacity = 1, 100);  

        // Asigna eventos a los botones de editar y eliminar
        nuevaFila.querySelector('.btn-editar').addEventListener('click', function() {
            editarPresupuesto(cliente, telefono, manoObra, repuestos);
        });

        nuevaFila.querySelector('.btn-eliminar').addEventListener('click', function() {
            eliminarPresupuesto(cliente);
        });
    }

    // Guarda el presupuesto en localStorage
    function guardarEnStorage(cliente, telefono, manoObra, repuestos, total) {
        let presupuesto = { cliente: cliente, telefono: telefono, manoObra: manoObra, repuestos: repuestos, total: total };
        let historial = JSON.parse(localStorage.getItem('historialPresupuestos')) || [];
        historial.push(presupuesto);
        localStorage.setItem('historialPresupuestos', JSON.stringify(historial));
    }

    // Carga el historial de presupuestos desde localStorage al iniciar la página
    function cargarHistorialDesdeStorage() {
        let historial = JSON.parse(localStorage.getItem('historialPresupuestos')) || [];
        historial.forEach(presupuesto => {
            guardarPresupuestoEnHistorial(presupuesto.cliente, presupuesto.telefono, presupuesto.manoObra, presupuesto.repuestos, presupuesto.total);
        });
    }

    // Carga datos desde un archivo JSON
    function cargarDatosDesdeJSON() {
        fetch('presupuestos.json')  
            .then(response => response.json())  
            .then(data => {
                data.forEach(presupuesto => {
                    guardarPresupuestoEnHistorial(presupuesto.cliente, presupuesto.telefono, presupuesto.manoObra, presupuesto.repuestos, presupuesto.total);
                });
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }

    // Edita un presupuesto existente
    function editarPresupuesto(cliente, telefono, manoObra, repuestos) {
        nombreClienteInput.value = cliente;
        telefonoInput.value = telefono;
        manoObraInput.value = manoObra;
        repuestosInput.value = repuestos;
        eliminarPresupuesto(cliente);
    }

    // Elimina un presupuesto del historial y de localStorage
    function eliminarPresupuesto(cliente) {
        let filas = historialPresupuestos.getElementsByTagName('tr');
        for (let i = 0; i < filas.length; i++) {
            if (filas[i].cells[0].textContent === cliente) {
                historialPresupuestos.deleteRow(i);
            }
        }

        let historial = JSON.parse(localStorage.getItem('historialPresupuestos')) || [];
        historial = historial.filter(presupuesto => presupuesto.cliente !== cliente);
        localStorage.setItem('historialPresupuestos', JSON.stringify(historial));
    }

    // Limpia los campos del formulario
    function limpiarCampos() {
        nombreClienteInput.value = '';
        telefonoInput.value = ''; 
        manoObraInput.value = '';
        repuestosInput.value = '';
    }

    // Inicializa la aplicación cargando datos y asignando eventos
    cargarDatosDesdeJSON();
    cargarHistorialDesdeStorage();
    botonGenerarPresupuesto.addEventListener('click', generarPresupuesto);
});