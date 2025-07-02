import { obtenerCategorys } from "./api/productos.js"
import{eliminarCategoria,updateCategoria,funcionChequeado,restaurarEstado } from "./Categorias.js" 

 

const botonTodas=document.getElementById("allCategoriesButton")  

let entrada=true 



botonTodas.addEventListener("click",async()=>{    

   try{ 

    const data = await  obtenerCategorys()
    console.log(data) 
       

    const cuerpocategoria = document.getElementById("cuerpo-categorias"); 
    cuerpocategoria.innerHTML = "";


    if(data.length>0 && entrada){
  
          data.forEach(data => { 
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td><input type="checkbox" class="form-check-input select-category" data-id="${data.categoria_id}"></td>
                <td>${data.nombre_categoria}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn__editar" data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-eliminar btn__borrar" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;

            cuerpocategoria.appendChild(fila); 
          
            const checkbox = fila.querySelector(".select-category");
            checkbox.addEventListener("change", () => {
                funcionChequeado(checkbox, data.nombre_categoria, fila);
            }); 

            const btnEliminar = fila.querySelector(".btn-eliminar");
            btnEliminar.addEventListener("click", () => {
                eliminarCategoria(data.categoria_id);
            }); 
            const btnEditar = fila.querySelector(".btn__editar");
            btnEditar.addEventListener("click", () => {
                updateCategoria( data.categoria_id);
            }); 
             restaurarEstado(data.nombre_categoria, checkbox, fila);
             
  
          }); 
          
    }  
    
    else{  
        let entrada=false
        cuerpocategoria.innerHTML = ""
           
    }

    
   } 

   catch(error){
    console.log(error)
   } 

   entrada=!entrada

} )