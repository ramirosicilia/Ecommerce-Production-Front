const apiUrl=import.meta.env.VITE_BACKEND_URL


export async function  authenticatenUser(){

    try {  
        const obtenerToken = localStorage.getItem('token');
        const obtenerUsuario = localStorage.getItem('dni'); 

        console.log(obtenerUsuario, 'obtenerUsuario');

        if (!obtenerToken || !obtenerUsuario) {
            return;
        } 

        const respuesta = await fetch(`${apiUrl}/ruta-protegida`, {
            headers: {
                'Authorization': `Bearer ${obtenerToken}`
            } 
        });  

        if (!respuesta.ok) {
            // Si hay un error, lanza un error con el mensaje del backend
            const errorData = await respuesta.json();
            throw new Error(errorData.error);
        } 
      




        const datos = await respuesta.json(); 

        console.log(datos, 'datos'); 
        document.cookie = `token=${datos.token}`;
        document.cookie = `usuario=${obtenerUsuario}`; 



           if(datos){ 
            Swal.fire({
                title: `el usuario fue: ${datos.respuesta}`,
                showClass: {
                    popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                    `
                },
                hideClass: {
                    popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                    `
                }   
            }); 


           }
           
           
        

    }

    catch (err) {
        console.log("no se recbio la cookie" ,err.message);
    }

} 



