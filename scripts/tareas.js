window.addEventListener("load", function() {
    let tareasPendientes = document.querySelector(".tareas-pendientes"),
        tareasTerminadas = document.querySelector(".tareas-terminadas"),
        infoUsuario = JSON.parse(localStorage.getItem("infoUsuario")),
        formulario = document.querySelector("form"),
        inputNuevaTarea = document.querySelector("#descripcion-tarea"),
        botonNuevaTarea = document.querySelector(".agregar-tarea"),
        username = document.querySelector("#user-info");
        
    
    renderizarTareas();
    username.innerHTML = infoUsuario.firstName;
    
    //renderizar tareas existentes, borrar, terminar y reiniciar una tarea
    function renderizarTareas() {
        fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", {
            "method" : "GET",
            "headers" : {
                "Authorization" : infoUsuario.tokenUsuario,
                "content-type" : "application/json"
            }
        })
        .then((respuesta) => respuesta.json())
        .then((tareas) => {
            vaciar(tareasPendientes);
            vaciar(tareasTerminadas);
            tareas.forEach((tarea) => {
                if(tarea.completed) {
                    tareasTerminadas.innerHTML += `
                        <li class="tarea" data-task="${tarea.id}" data-status="${tarea.completed}">
                            <div class="not-done"></div>
                            <div class="descripcion">
                                <p class="nombre">${tarea.description}</p>
                                <p class="timestamp">${tarea.createdAt.slice(0, 10).split('-').reverse().join('/')}</p>
                            </div>
                            <button class="reiniciar">
                                <img src="./img/reiniciar.svg" alt="reiniciar tarea">
                            </button>
                            <button class="borrar">
                                <img src="./img/borrar.png" alt="borrar tarea">
                            </button>
                        </li>`
                } else {
                    tareasPendientes.innerHTML += `
                        <li class="tarea"  data-task="${tarea.id}" data-status="${tarea.completed}">
                            <div class="not-done"></div>
                            <div class="descripcion">
                                <p class="nombre">${tarea.description}</p>
                                <p class="timestamp">${tarea.createdAt.slice(0, 10).split('-').reverse().join('/')}</p>
                                
                            </div>
                            <button class="terminar">
                                <img src="./img/terminar.png" alt="terminar tarea">
                            </button>
                            <button class="borrar">
                                <img src="./img/borrar.png" alt="borrar tarea">
                            </button>
                        </li>`
                }
            });
            //borrar una tarea
            let botonesBorrarTarea = document.querySelectorAll(".borrar");
            botonesBorrarTarea.forEach((boton) => {
                let liParent = boton.parentNode;
                boton.addEventListener("click", function() {
                    let configuracion = {
                            "method" : "DELETE",
                            "headers" : {
                                "Authorization" : infoUsuario.tokenUsuario
                            }
                        };
                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${liParent.dataset.task}`, configuracion)
                    .then((respuesta) => respuesta.json())
                    .then((info) => renderizarTareas())
                    .catch((error) => alert(error))
                })
            });
            // terminar una tarea
            let botonesTerminarTarea = document.querySelectorAll(".terminar");
            botonesTerminarTarea.forEach((boton) => {
                let liParent = boton.parentNode;
                boton.addEventListener("click", function() {
                    let cambio = {
                        "completed" : true    
                        },
                        configuracion = {
                            "method" : "PUT",
                            "headers" : {
                                "authorization" : infoUsuario.tokenUsuario,
                                "content-type" : "application/json"
                            },
                            "body" : JSON.stringify(cambio)
                        }
                    
                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${liParent.dataset.task}`, configuracion)
                    .then((respuesta) => respuesta.json())
                    .then((info) => renderizarTareas())
                    .catch((error) => alert(error))
                })
            });
            // reiniciar una tarea terminada
            let botonesReiniciarTarea = document.querySelectorAll(".reiniciar");
            botonesReiniciarTarea.forEach((boton) => {
                let liParent = boton.parentNode;
                boton.addEventListener("click", function() {
                    let cambio = {
                        "completed" : false
                        },
                        configuracion = {
                            "method" : "PUT",
                            "headers" : {
                                "authorization" : infoUsuario.tokenUsuario,
                                "content-type" : "application/json"
                            },
                            "body" : JSON.stringify(cambio)
                        }
                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${liParent.dataset.task}`, configuracion)
                    .then((respuesta) => respuesta.json())
                    .then((info) => renderizarTareas())
                    .catch((error) => alert(error))
                })
            });
        });
    };

    //agrega una nueva tarea
    botonNuevaTarea.addEventListener("click", function(e){
        e.preventDefault();
        let tareaNueva = {
            description: inputNuevaTarea.value,
            completed: false
            },
            configuracionCrearTarea = {
                "method" : "POST",
                "headers" : {
                    "Authorization" : infoUsuario.tokenUsuario,
                    "content-type" : "application/json"
                },
                "body" : JSON.stringify(tareaNueva)
                }

        fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", configuracionCrearTarea)
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(nuevaTarea) {
            renderizarTareas();  
        })
        .catch(function(error) {
            console.log(error);
        })
        formulario.reset();
        
    });

    //desplegable de la info del usuario
    username.addEventListener("click", function() {
        let cajaInfo = document.querySelector("#info-usuario");
        cajaInfo.classList.toggle("toggle");
        cajaInfo.innerHTML = `
            <p class="nombreUsuario">${infoUsuario.firstName} ${infoUsuario.lastName}</p>
            <p>Email: ${infoUsuario.email}</p>`
        
    })
               
    //vacia un elemento
    function vaciar(elemento) {
        elemento.innerHTML = ""
    };

});

