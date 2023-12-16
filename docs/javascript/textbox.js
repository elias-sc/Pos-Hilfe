let exerciseId = 0;

document.getElementById('code-input').addEventListener('keydown', function(e) {

    let start = this.selectionStart;
    let end = this.selectionEnd;

    switch(e.key){
        case 'Tab':
            e.preventDefault();
            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionEnd = start + 4;
            break;

        case 'Enter':
            e.preventDefault();
            const currentValue = this.value;
            const currentLine = currentValue.substring(0, start).split('\n').pop();

            const leadingWhitespace = currentLine.match(/^\s*/)[0];
            const newValue = currentValue.substring(0, start) + "\n" + leadingWhitespace + currentValue.substring(end);
            this.value = newValue;
            this.setSelectionRange(start + 1 + leadingWhitespace.length, start + 1 + leadingWhitespace.length);
            break;

        case '{':
            e.preventDefault();
            this.value = this.value.substring(0, start) + '{}' + this.value.substring(end);
            this.selectionEnd = start + 1;
            break;

        case '(':
            e.preventDefault();
            this.value = this.value.substring(0, start) + '()' + this.value.substring(end);
            this.selectionEnd = start + 1;
            break;

        case '[':
            e.preventDefault();
            this.value = this.value.substring(0, start) + '[]' + this.value.substring(end);
            this.selectionEnd = start + 1;
            break;

        case '"':
            e.preventDefault();
            this.value = this.value.substring(0, start) + '""' + this.value.substring(end);
            this.selectionEnd = start + 1;
            break;

        case 'Backspace':
            e.preventDefault();
            if(this.value.substring(start - 4, start) == "    "){
                this.value = this.value.substring(0, start - 4) + this.value.substring(end);
                this.selectionEnd = Math.max(start - 4, 0);
            } else{
                this.value = this.value.substring(0, start - 1) + this.value.substring(end);
                this.selectionEnd = Math.max(start - 1, 0);
            }
            break;
        default:
            break;

    }

});

document.getElementById('code-input').addEventListener('keyup', function(e){
    localStorage.setItem(exerciseId + "-code", this.value);
}),

window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    exerciseId = urlParams.get('id');

    const textBox = document.getElementById("code-input");
    textBox.value = localStorage.getItem(exerciseId + "-code");
    loadExercise();
}