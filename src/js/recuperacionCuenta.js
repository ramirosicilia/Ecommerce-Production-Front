
const formulario=document.getElementById("form-recuperacion") 
let entrada=true 

const apiUrl=import.meta.env.VITE_BACKEND_URL 
 





formulario.addEventListener('submit',async(e)=>{ 

    e.preventDefault() 

    const email=document.querySelector(".email__user").value 

    const container=document.getElementById("container-ingreso") 

    let emailValidar = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

    container.style.display = 'none';

   function validar(){
    if (!email) {
        container.style.display = 'flex'; // Muestra el error
          entrada = false;
      } else if (!emailValidar.test(email)) {
       container.style.display = 'flex'; // Muestra el error
          entrada = false;
      }  
      return entrada
   }   

     if(!validar()){ 
        return
       
     } 

   
      try{ 

        const peticion= await fetch(`${apiUrl}/recuperacion-cuenta`,{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            credentials: "include", 
            body:JSON.stringify({email})
        })  

        if (!peticion.ok) {
          // Si hay un error, lanza un error con el mensaje del backend
          const errorData = await peticion.json();
          throw new Error(errorData.error);
      } 
    



        const response=await peticion.json() 
        console.log(response) 
       
        

        if(response){  
       

          const emailDomain = email.split('@')[1]; 
          console.log(emailDomain)
          let redirectUrl;
    
          // Redirigir según el dominio
          if (emailDomain === 'gmail.com') {
            redirectUrl = 'https://mail.google.com/';
          } else if (emailDomain === 'hotmail.com' || emailDomain === 'live.com') {
            redirectUrl = 'https://outlook.live.com/'; 
          } else if (emailDomain === 'yahoo.com') {
            redirectUrl = 'https://mail.yahoo.com/';
          } else {
            alert("Dominio de correo no soportado. Por favor, accede a tu proveedor de correo directamente.");
            return; // Si no es un dominio soportado, salir de la función
          }
    
          // Redirigir al usuario al home del correo
          window.location.href = redirectUrl;

        } 

      

    
      } 
      catch (err) {
        // Captura el error y muestra una alerta al usuario
     
        Swal.fire({
            title: '¡Error!',
            text: err.message, // Muestra el mensaje del backend
            icon: 'error',
            confirmButtonText: 'Intenta de nuevo',
        });
    }
    
     setTimeout(() => { 
      e.target.reset()
      
     }, 1000);

})