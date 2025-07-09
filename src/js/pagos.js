import { obtenerUsuarios, pagoMercadoPago,} from "./api/productos.js"; 
import axios from 'axios';




   (async()=>{     

    const apiUrl=import.meta.env.VITE_PAYMENT_URL  
     const btnToken=document.getElementById("btn-token") 
     const containerSecret=document.getElementById("container-secret")  
    const inputToken=document.getElementById("input-Token")  



    let token        
    let tokenRecibido 


   

     containerSecret.addEventListener('click',async()=>{ 
  
        token=await obtenerToken()

        console.log(token,"token recibido00002222")


    }) 
function onFocusToken() { 
  
 


  if (!token) { 
     inputToken.readOnly = true;
    alert("Clickeá el rectángulo para obtener el token");
  } else { 
     inputToken.readOnly = true;
    tokenRecibido=token 
    inputToken.placeholder=tokenRecibido
    alert("Token ingresado");
  }


}

inputToken.addEventListener("click", onFocusToken);



   btnToken.addEventListener('click',async()=>{ 
     await fetchPayments();

  
   })

const obtenerToken = async () => { 


    try {
      const response = await axios.get(`${apiUrl}/token-mercadopago`);

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      const token = response.data;
      console.log("Token obtenido:", token);
      return token;

    } catch (error) {
      console.error("Error al obtener el token:", error.message);
      alert("Error al obtener el token de MercadoPago.");
      return null;
    }
  };

  // Obtener pagos y renderizar la tabla
 const fetchPayments = async () => { 
       if(!tokenRecibido){ 

        alert('no se enviado el token')
        return
       } 

      inputToken.placeholder="Access token ingresado"

  try {
    const usuarios = await obtenerUsuarios(); // primero traemos los usuarios
    console.log(usuarios.user,"usuarios")
    
         const pagosData=await pagoMercadoPago()

    const tableBody = document.getElementById('paymentsTable');

    if (pagosData?.length > 0) {
      tableBody.innerHTML = pagosData.map(payment => {
        const nombreUsuario = usuarios.user.find(user => user.usuario_id === payment.usuario_id)?.usuario || 'Usuario desconocido';
       
        return `
          <tr>
            <td>${payment.payment_id}</td>
            <td>${payment.status}</td>
            <td>$${payment.transaction_amount.toFixed(2)}</td>
            <td>${nombreUsuario}</td>
            <td>
              <button class="btn btn-sm btn-info detalle-btn" data-status="${payment.status}" data-preference_id="${payment.preference_id}" data-user_id="${payment.usuario_id}">Detalles</button>
            </td>
          </tr>
        `;
      }).join(''); 

        document.querySelectorAll('.detalle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const user_id=btn.getAttribute('data-user_id');
          const preference_id=btn.getAttribute('data-preference_id'); 
          const paymentStatus=btn.getAttribute('data-status');  


          if(String(paymentStatus).trim()==="rejected"){ 
            alert("El pago fue rechazado por Mercado Pago") 
            return 
            
          }
           
           console.log(user_id,'user')
           console.log(preference_id,'id pago')  

          

           if(user_id!=null && preference_id!=null){ 

            const objectoStorage={
              user:user_id,
              pagoID:preference_id
            } 

             localStorage.setItem("pagos",JSON.stringify(objectoStorage)) 

             setTimeout(() => {
                  window.location.href="./ordenes.html"
              
             }, 800);

      
           } 

           else{
            alert('no se pudo recuperar la orden')
           }
        });
      });

    } else {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">No se encontraron pagos registrados.</td>
        </tr>
      `;
    }  

    

  } catch (error) {
    console.error("Error al obtener los pagos:", error.message);
    alert("Error al obtener los pagos.");
  }
};


   })()

   
 
    
  

 

  // Ejecutar al cargar

  
   