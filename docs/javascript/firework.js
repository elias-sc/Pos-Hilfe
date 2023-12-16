function fire(){

    const wrapper = document.getElementById("firework-wrapper");
    const max = 2;

    for(let i = 0; i < max; i++) {

        const container = document.createElement("div");
        container.id = "firework-container";

        for(let j = 0; j < 3; j++){
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = (30 + Math.random() * 40) + "%";

            sleep(200 * i).then(() => {
                container.append(firework);
                wrapper.append(container);
    
    
                firework.addEventListener('animationend', () => {
                    firework.remove();
                });
            })


        }
        
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
