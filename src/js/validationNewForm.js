

export const validacionNuevoFormulario=()=>{ 

    const container1 = document.getElementById('container-1-new');
    const container2 = document.getElementById('container-2-new');
    let entrada=true 
  
    const usuarioIngresado = document.getElementById("usuario-new-ingresado").value; 
    const passWordIngresado = document.getElementById("usuario-new-password").value;
  
    const usuarioIngresadoValidado = /^[a-zA-Z0-9_-]{3,16}$/; 

    console.log(usuarioIngresadoValidado)

    const usuarioIngresadoPassword =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,16}$/;

      console.log(container1)
      console.log(container2) 

      

    container1.style.display = 'none';
    container2.style.display = 'none';

    if (!usuarioIngresado) {
    container1.style.display = 'flex'; // Muestra el error
        entrada = false;
    } else if (!usuarioIngresadoValidado.test(usuarioIngresado)) {
    container1.style.display = 'flex'; // Muestra el error
        entrada = false;
    }
  
    if (!passWordIngresado) {
    container2.style.display = 'flex'; // Muestra el error
        entrada = false;
    } else if (!usuarioIngresadoPassword.test(passWordIngresado)) {
    container2.style.display = 'flex'; // Muestra el error
        entrada = false;
    }
  
             return entrada
}