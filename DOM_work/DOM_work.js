const One = document.getElementsByClassName('Red_square')
const Total_One = One.length
for (let i = 0; i < One.length; i++){
    One[i].style.backgroundcolor = "red"
}

const Two = document.getElementsByClassName('Yellow_square')
const Total_Two = Two.length
for (let i = 0; i < Two.length; i++){
    Two[i].style.backgroundcolor = 'yellow'
    Two[i].style.color = 'black'
}

const Three = document.getElementsByClassName('Indigo_square')
const Total_Three = Three.length
for (let i = 0; i < Three.length; i++){
    Three[i].style.backgroundcolor = 'indigo'
    Three[1].style.color = 'white'
}

const Four = document.getElementsByClassName('Magenta_square')
const Total_Four = Four.length
for (let i = 0; i < Four.length; i++){
    Four[i].style.backgroundcolor = 'magenta'
}


