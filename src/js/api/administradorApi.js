

const apiUrl = import.meta.env.VITE_BACKEND_URL;



export const adminApi=async()=>{ 

  try{ 

    const response= await fetch(`${apiUrl}/administrador`) 
    console.log(response,"admin") 

    if(!response.ok){ 

      const dataErrror= await response.json() 
      throw new Error(dataErrror.error)

    } 

    else{
      const adminData= await response.json()  
    
      let adminName=adminData[0].nombre_usuario
       console.log(adminName)

      return adminName
    } 

  } 


  catch (err) {
    console.error("Error:", err);
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
   
  }


}  


