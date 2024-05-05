class ProductoZara {
    constructor(imagen, titulo, precio, categoria) {
        this.imagen = imagen;
        this.titulo = titulo;
        this.precio = precio;
        this.categoria = categoria;
    }

}

let Zara = []
const contenedorMayor = document.getElementById("main")


const listaProducto = (producto)=>{ 

    contenedorMayor.innerHTML += `
    <section>
        <section class="container-fluid" id="productos">
            <div class="card" style="width: 16rem;" >
                <img src=${producto.imagen} alt=""/>
                <div class="card-body" >
                    <div class="card-body">
                        <h3>${producto.nombre}</h3>
                        <p>$${producto.precio}</p>
                        <button class="btn btn-primary Botoncarrito"> Comprar</button>
                    </div>
    
                </div>
            </div>

        </section>
    
    </section>
     `
}


const agregadoraDeEvenetosDeBoton = () =>{
    const BotonPrincipal = document.getElementsByClassName("Botoncarrito") 
    const BotonesPrincipalArray = Array.from(BotonPrincipal)
    BotonesPrincipalArray.forEach((boton) =>{
        boton.addEventListener("click", (e) =>{
            const ProductoElegido = e.target.parentElement.children[0].innerText;
            const productosPrecio = Number(e.target.parentElement.children[1].innerText.slice(1));

            agregador({
                producto: ProductoElegido,
                cantidad: 0,
                precio: productosPrecio,
            })
        })
    })
}



const CategoriaProducto = document.getElementsByClassName("category")
const ArrayProducto = Array.from(CategoriaProducto)


ArrayProducto.forEach(category=>{
    category.addEventListener("click", (e)=>{
        let categoria = e.target.innerText
        
        const Filtro = Zara.filter((producto)=>{
            return producto.categoria.toUpperCase() == categoria.toUpperCase()
        })

        contenedorMayor.innerHTML = ""
        
        Filtro.forEach((producto)=>{
            listaProducto(producto)
        })

        ActualizadorDeCarrito()
        agregadoraDeEvenetosDeBoton()
    })

})


//CARRITOFISICO
const carritoFisico = document.getElementById("carritoFisico")
const botonCarrito = document.getElementById("btnCarrito") //carrito

botonCarrito.addEventListener("click", ()=>{
    carritoFisico.classList.toggle('active')
})


///CARRITO DE COMPRA
//Boton de Arriba 
const Carrito = JSON.parse(localStorage.getItem("carrito")) || []


const ConteinerProducto = document.getElementById("productos")
const ConteinerCarrito = document.getElementById("btnCarrito") //ID de boton HTML

//NUEVO
class CarritoCompra {
    constructor(){
        this.productosZara = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    agregarProducto(producto) {
        const productoExistente = this.productosZara.find(prod => prod.producto === producto.nombre);
        
        if(productoExistente){
            productoExistente.cantidad++;
        }else{
            producto.cantidad = 1;
            this.productosZara.push(producto);
        }

        this.guardarCarrito();
    }

    calcularTotal() {
        let total = 0;
        for (const producto of this.productosZara) {
            total += producto.precio * producto.cantidad;
        }
        // Redondear el total a tres decimales y convertirlo a cadena
        total = total.toFixed(3);
        this.guardarCarrito();
        return total;
    }
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.productosZara));
    }

    limpiarCarrito() {
        localStorage.removeItem('carrito');
        this.productosZara = [];
    }
}

const nuevoCarritoDeCompra = new CarritoCompra()




//ACTUALIZADOR DE CARRITO
const ActualizadorDeCarrito = () =>{

    carritoFisico.innerHTML = ""

    nuevoCarritoDeCompra.productosZara.forEach((producto)=>{
        
        carritoFisico.innerHTML += `
        
            <div class="card "" >
                <div class="card-body" >
                    <h3>${producto.producto}</h3>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p>Precio $${producto.precio}</p>
                    <button class="btn BotonEliminar ${ producto.producto}"> Eliminar </button>
                </div>
            </div>
        `
    })

    carritoFisico.innerHTML += `
    <div>
        <p>Total: $${nuevoCarritoDeCompra.calcularTotal()}
        <button id="borrar">Terminar la Compra.</button>
        <button id="eliminar">Cancelar.</button>
    </div>`

        //Libreria - Terminar la compra.
    const compraRealizada = document.getElementById("borrar")
    compraRealizada.addEventListener("click", ()=>{
        nuevoCarritoDeCompra.limpiarCarrito();
        Swal.fire({
            title: "¡Compra realizada!",
            text: "Gracias por confirar en Nosotros!. El envió se realizara en la próxima semana.",
            icon: "success"
        }).then(() => {
            ActualizadorDeCarrito();
        });
    })

    //Libreria - Cancelar.
    const eliminar = document.getElementById("eliminar")
    eliminar.addEventListener("click", ()=>{
        nuevoCarritoDeCompra.limpiarCarrito();
        Swal.fire({
            icon: "error",
            title: "Su compra fue cancelada con éxito",

        }).then(() => {
            ActualizadorDeCarrito();
        });
    })


    //Boton Eliminar
    const BotonEliminar = document.getElementsByClassName("BotonEliminar")
    const BotonEliminarArray = Array.from(BotonEliminar)

    BotonEliminarArray.forEach((boton) =>{
        boton.addEventListener("click", agregadorDeEliminar)
        
    })

}



const agregadorDeEliminar = (e) =>{
    const ProductoElegido = e.target.parentElement.children[0].innerText
    const ProductoElegido2 = e.target.parentElement
    ProductoElegido2.remove()


    const ArrayDeProductos = nuevoCarritoDeCompra.productosZara.map(producto => producto.producto)
    const indice = ArrayDeProductos.indexOf(ProductoElegido)

    
    if(nuevoCarritoDeCompra.productosZara[indice].cantidad == 1){
        nuevoCarritoDeCompra.productosZara.splice(indice, 1)
        
    }else{
        nuevoCarritoDeCompra.productosZara[indice].cantidad -= 1

    }
    ActualizadorDeCarrito(ArrayDeProductos)


}


const agregador = (producto)=>{
    const buscador = nuevoCarritoDeCompra.productosZara.find((productoCarrito) =>{
        return productoCarrito.producto == producto.producto
    })
    
    if(buscador !== undefined){
        const indice = nuevoCarritoDeCompra.productosZara.findIndex(p => p.producto === producto.producto)

        nuevoCarritoDeCompra.productosZara[indice].cantidad += 1
    }else{
        nuevoCarritoDeCompra.agregarProducto({...producto, cantidad: 1, precio: producto.precio });

    }

    ActualizadorDeCarrito()
}


document.addEventListener("DOMContentLoaded", ()=>{
    fetch("./info.json")
        .then(data => data.json())
        .then(productos => {
            Zara = productos.productosZara.map(productos => productos)
            Zara.forEach((producto)=>{
                listaProducto(producto)
            })
            agregadoraDeEvenetosDeBoton()
            ActualizadorDeCarrito()
        })

})

