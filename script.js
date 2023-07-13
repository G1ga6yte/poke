
let list = document.querySelector(".list")
let arr = []

async function getPokemonData() {
    const page = 1
    const limit = 300
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * limit}&limit=${limit}`)
            const data = await response.json()
            const results = data.results
            await Promise.all(results.map(async (res) => {
                const result = await fetch(res.url)
                const item = await result.json()
                const itemSpec = await fetch(item.species.url)
                const SpecRes = await itemSpec.json()
                const link = {
                    description: SpecRes['flavor_text_entries'][0]['flavor_text'],
                    name: item.name,
                    url: item.sprites.other["official-artwork"].front_default,
                    hashId: item.id
                }
                arr.push(link)
            }));
            renderPokemon(arr)


            resolve(arr)

        } catch (err) {
            reject(err)
        }
    })

}

let pokeInfoBlock = document.querySelector(".pokeinfoblock")
let inp = document.querySelector(".input-search")
let inpBlock = document.querySelector(".input-searched")


function appendChildren(parent, ...children) {
    children.forEach((child) => {
        parent.appendChild(child)
    })
}


async function renderPokemon (data) {
     list.innerHTML = ""

    let pages = Math.ceil(data.length / 20)
    let pagesBlock = document.querySelector(".pagination")
    pagesBlock.innerHTML = ""
    let paginated = []

    for (let i = 0; i < pages; i++) {
        let start = i*20
        let end = (i+1)*20
        paginated.push([])
        for (let j = start; j < end; j++) {
            if(data[j] === undefined){
                break
            }
            paginated[i].push(data[j])
        }

        let page = document.createElement("button")
        page.textContent = i+1
        page.addEventListener("click", ()=>{
            renderWithPages(paginated[i])
            window.scrollTo({ top: 0, behavior: 'smooth' })
        })
        pagesBlock.appendChild(page)

    }

    renderWithPages(paginated[0])


    function renderWithPages (datta){
        list.innerHTML = ""
        datta.forEach((pokemon) => {

            let hashid = document.createElement("span")

            if(pokemon.hashId <10){
                hashid.textContent = "#00"+ pokemon.hashId
            } else if(pokemon.hashId <100){
                hashid.textContent = "#0"+pokemon.hashId
            } else {
                hashid.textContent = "#"+pokemon.hashId
            }


            let gameblock = document.createElement("div")
            list.appendChild(gameblock)
            gameblock.classList.add("pokemonBlock")
            let name = document.createElement("p")
            name.textContent = pokemon.name
            let img = document.createElement("img")
            img.src = pokemon.url
            img.width = 100

            appendChildren(gameblock, img, name, hashid)

            gameblock.addEventListener("click", ()=>{
                openWindow(arr, pokemon)
            })
        })
    }

 }



getPokemonData().then(()=>{
    let select = document.querySelector("select")
    let selectedOrder = select.value


    select.addEventListener("change" , (event) =>{
        list.innerHTML = ""
        selectedOrder = event.target.value

        if(selectedOrder === "low-number" || selectedOrder === "high-number"){
            sortingByIndex(selectedOrder)
        } else {
            sortingByNames(selectedOrder)
        }
    })

    inp.addEventListener("keyup", ()=>{
        inpBlock.innerHTML = ""
        if(inp.value === ""){
            inpBlock.innerHTML = ""

        } else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name.toLowerCase().startsWith(inp.value)) {
                    let block = document.createElement("div")
                    let p = document.createElement("p")
                    let image = document.createElement("img")
                    image.width = 30
                    image.src = arr[i].url
                    block.appendChild(image)
                    p.textContent = arr[i].name
                    p.addEventListener("click", ()=>{
                        openWindow(arr, arr[i])
                    })
                    block.appendChild(p)
                    inpBlock.appendChild(block)
                }
            }
        }

    })
    console.log(arr)



    function sortingByNames (order){
        if(order === "a-z"){
            arr.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
        }
        if(order === "z-a"){
            arr.sort(function (a,b){
                if (a.name < b.name) {
                    return 0;
                }
                return -1;
            })
        }
        renderPokemon(arr)
    }

    function sortingByIndex(order){
        arr.sort((a,b) => {
            if(order === "low-number"){
                return a.hashId - b.hashId
            }else if(order === "high-number"){
                return b.hashId - a.hashId
            }else{
                return console.log("err")
            }
        });
        renderPokemon(arr)
    }
    sortingByIndex(selectedOrder)

 })


function openWindow (arr, ind){
    pokeInfoBlock.style.display = "block"
    let img = document.createElement("img")
    let closebtn = document.createElement("div")
    let h2 = document.createElement("h2")
    let desc = document.createElement("p")
    closebtn.addEventListener("click", ()=>{
        pokeInfoBlock.innerHTML = ' '
        pokeInfoBlock.style.display = "none"
        inp.value = ""
        inpBlock.innerHTML = ""
    })
    closebtn.textContent = "X"
    img.src = ind.url
    img.width = 400
    if(ind.hashId <10){
        h2.textContent = ind.name + " #00" + ind.hashId
    } else if(ind.hashId <100){
        h2.textContent = ind.name + " #0" + ind.hashId
    } else {
        h2.textContent = ind.name + " #" + ind.hashId
    }
    desc.textContent = ind.description
    pokeInfoBlock.appendChild(h2)
    pokeInfoBlock.appendChild(closebtn)
    pokeInfoBlock.appendChild(img)
    pokeInfoBlock.appendChild(desc)
}



