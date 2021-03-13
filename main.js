async function funfact() {
    const factData = await fetch ('https://uselessfacts.jsph.pl/random.json?language=en');
    const factJSON = await factData.json()
    console.log(factJSON.text)
    document.getElementById("fun_fact").innerHTML = "Did You Know: " + factJSON.text.toString();
}
funfact()