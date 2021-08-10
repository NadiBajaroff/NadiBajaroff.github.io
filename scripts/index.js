
window.addEventListener("load", function() {

    let formularioRegistro = document.querySelector("#registro"),
        nombreRegistro = document.querySelector("#reg-nombre"),
        apellidoRegistro = document.querySelector("#reg-apellido"),
        contraseniaRegistro = document.querySelector("#reg-contrasenia"),
        reContraseniaRegistro = document.querySelector("#reg-re-contrasenia"),
        emailRegistro = document.querySelector("#reg-email");
    
    let formularioIngreso = document.querySelector("#ingreso"),
        emailIngreso = document.querySelector("#ing-email"),
        contraseniaIngreso = document.querySelector("#ing-contrasenia");
        
    
    // crea un nuevo usuario
    formularioRegistro.addEventListener("submit", function(e) {
        e.preventDefault();
        let datosUsuario = {
            firstName: nombreRegistro.value,
            lastName: apellidoRegistro.value,
            email: emailRegistro.value,
            password: contraseniaRegistro.value
        };

        let configuracion = {
            "method" : "POST",
            "headers" : {
                "content-type" : "application/json"
            },
            "body" : JSON.stringify(datosUsuario)
        };

        if(contraseniaRegistro.value === reContraseniaRegistro.value) {
            fetch("https://ctd-todo-api.herokuapp.com/v1/users", configuracion)
                .then((respuesta) => respuesta.json())
                .then((info) => {
                    let infoUsuario = {
                        tokenUsuario : info.jwt,
                        firstName: nombreRegistro.value,
                        lastName: apellidoRegistro.value,
                        email: emailRegistro.value,
                        contrasenia : contraseniaRegistro.value
                    }
                    
                    localStorage.setItem("infoUsuario", JSON.stringify(infoUsuario));
                    window.location.href="https://NadiBajaroff.github.io/lista-tareas.html"
                    
                })
                .catch((error) => alert(error))
        } else {
            Swal.fire("Las contraseñas no coinciden")
        }   
    });


    // ingreso con usuario existente
    formularioIngreso.addEventListener("submit", function(e) {
        e.preventDefault();
        let datosIngreso = {
            email : emailIngreso.value,
            password : contraseniaIngreso.value
        };
        let configuracionIngreso = {
            "method" : "POST",
            "headers" : {
                "content-type" : "application/json"
            },
            "body" : JSON.stringify(datosIngreso)
        };

        fetch("https://ctd-todo-api.herokuapp.com/v1/users/login", configuracionIngreso)
        .then((respuesta) => {
            switch(respuesta.status) {
                case 400 : 
                    Swal.fire("Contraseña incorrecta").then(() => window.location.reload())
                    break;
                case 404 :
                    Swal.fire("Usuario inexistente").then(() => window.location.reload())
                    break;
                case 500 :
                    Swal.fire("Error! Intente nuevamente").then(() => window.location.reload())
                    break;    
                default : 
                    return respuesta.json()
            }
        })
        .then((info) => {
            let token = info.jwt;
            fetch("https://ctd-todo-api.herokuapp.com/v1/users/getMe", {
                    "method" : "GET",
                    "headers" : {
                        "authorization" : token, 
                    }
            })
            .then((respuesta) => respuesta.json())
            .then((info) => {
                let infoUsuario = {
                        tokenUsuario : token,
                        firstName: info.firstName,
                        lastName: info.lastName,
                        email: info.email
                }               
                localStorage.setItem("infoUsuario", JSON.stringify(infoUsuario));
                window.location.href="https://NadiBajaroff.github.io/lista-tareas.html"
            })
            .catch((error) => console.log(error))
        })
        .catch((error) => console.log(error))
    });    
});

