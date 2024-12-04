
// este js maneja la creación de presupuestos para clientes. 
// al cargar la pagina se activan varias funciones:
// cuando se hace clic en el botón "Generar Presupuesto", se valida la información ingresada (nombre, mano de obra, repuestos) y se calcula el total.
// si todo es válido, se muestra el presupuesto, se guarda en un historial visual dentro de la tabla y también en localStorage para persistir los datos.
// los presupuestos almacenados pueden ser editados o eliminados desde la tabla de historial, actualizando tanto la interfaz como el almacenamiento local.
// el historial de presupuestos también se carga automáticamente al iniciar la página desde los datos almacenados en localStorage.

document.addEventListener('DOMContentLoaded', function() {
    
    let botonGenerarPresupuesto = document.getElementById('generar-presupuesto');
    let nombreClienteInput = document.getElementById('nombre-cliente');
    let manoObraInput = document.getElementById('mano-obra');
    let repuestosInput = document.getElementById('repuestos');
    let resultadoDiv = document.getElementById('resultado');
    let historialPresupuestos = document.getElementById('historial-presupuestos').getElementsByTagName('tbody')[0];

    // calcular el total
    function calcularPresupuesto(manoObra, repuestos) {
        return manoObra + repuestos;
    }

    // generar el presupuesto
    function generarPresupuesto() {
        let nombreCliente = nombreClienteInput.value.trim();
        let manoObra = parseFloat(manoObraInput.value.trim());
        let repuestos = parseFloat(repuestosInput.value.trim());

        if (nombreCliente === '' || isNaN(manoObra) || isNaN(repuestos)) {
            alert('por favor, completa todos los campos.');
            return;
        }

        let total = calcularPresupuesto(manoObra, repuestos);
        resultadoDiv.innerHTML = '<h3>Presupuesto para: ' + nombreCliente + '</h3>' +
                                 '<p>Mano de obra: $' + manoObra + '</p>' +
                                 '<p>Repuestos: $' + repuestos + '</p>' +
                                 '<p><strong>Total: $' + total + '</strong></p>';

        //historial y localStorage
        guardarPresupuestoEnHistorial(nombreCliente, manoObra, repuestos, total);
        guardarEnStorage(nombreCliente, manoObra, repuestos, total);

        limpiarCampos();
    }

    //presupuesto en el historial visual
    function guardarPresupuestoEnHistorial(cliente, manoObra, repuestos, total) {
        let nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = '<td>' + cliente + '</td>' +
                              '<td>$' + manoObra + '</td>' +
                              '<td>$' + repuestos + '</td>' +
                              '<td>$' + total + '</td>' +
                              '<td>' +
                              '<button class="btn-editar">Editar</button>' +
                              '<button class="btn-eliminar">Eliminar</button>' +
                              '</td>';
        historialPresupuestos.appendChild(nuevaFila);

        //editar
        nuevaFila.querySelector('.btn-editar').addEventListener('click', function() {
            editarPresupuesto(cliente, manoObra, repuestos, total);
        });

        // eliminar
        nuevaFila.querySelector('.btn-eliminar').addEventListener('click', function() {
            eliminarPresupuesto(cliente);
        });
    }

    // guarda en localStorage
    function guardarEnStorage(cliente, manoObra, repuestos, total) {
        let presupuesto = { cliente: cliente, manoObra: manoObra, repuestos: repuestos, total: total };
        let historial = JSON.parse(localStorage.getItem('historialPresupuestos')) || [];
        historial.push(presupuesto);
        localStorage.setItem('historialPresupuestos', JSON.stringify(historial));
    }

    // carga historial desde localStorage
    function cargarHistorialDesdeStorage() {
        let historial = JSON.parse(localStorage.getItem('historialPresupuestos')) || [];
        for (let i = 0; i < historial.length; i++) {
            let presupuesto = historial[i];
            guardarPresupuestoEnHistorial(presupuesto.cliente, presupuesto.manoObra, presupuesto.repuestos, presupuesto.total);
        }
    }

    // edita presupuesto
    function editarPresupuesto(cliente, manoObra, repuestos, total) {
        nombreClienteInput.value = cliente;
        manoObraInput.value = manoObra;
        repuestosInput.value = repuestos;
        eliminarPresupuesto(cliente);
    }

    // elimina presupuesto
    function eliminarPresupuesto(cliente) {
        let filas = historialPresupuestos.getElementsByTagName('tr');
        for (let i = 0; i < filas.length; i++) {
            if (filas[i].cells[0].textContent === cliente) {
                historialPresupuestos.deleteRow(i);
            }
        }

        let historial = JSON.parse(localStorage.getItem('historialPresupuestos')) || [];
        historial = historial.filter(function(presupuesto) {
            return presupuesto.cliente !== cliente;
        });
        localStorage.setItem('historialPresupuestos', JSON.stringify(historial));
    }

    // limpia campos de entrada
    function limpiarCampos() {
        nombreClienteInput.value = '';
        manoObraInput.value = '';
        repuestosInput.value = '';
    }

    cargarHistorialDesdeStorage();
    botonGenerarPresupuesto.addEventListener('click', generarPresupuesto);
});
