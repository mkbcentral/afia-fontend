<template>
    <div class="main">
        <div class="container">
            <div class="box">
                <div class="content">
                    <i class="fas fa-folder-open fa-solid fa-3x"></i>
                    <p>reception</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-medkit fa-solid fa-3x"></i>
                    <p>Dispensaire</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-capsules fa-solid fa-3x"></i>
                    <p>Pharmacie</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-microscope fa-solid fa-3x "></i>
                    <p>Para clinique</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-file-alt fa-solid fa-3x"></i>
                    <p>Finance</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-heartbeat fa-solid fa-3x"></i>
                    <p>Méecine spécilisée</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-user-md fa-solid fa-3x"></i>
                    <p>Cabinet médical</p>
                </div>
            </div>
            <div class="box">
                <div class="content">
                    <i class="fas fa-chart-pie fa-solid fa-3x"></i>
                    <p>Statistiques</p>
                </div>
            </div>

            <div class="box">
                <RouterLink to="/admin/settings">
                    <div class="content">
                        <i class="fas fa-tools fa-solid fa-3x"></i>
                        <p>Pramètres</p>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-self: center;
    min-height: 100vh;
    background-image: url('../assets/images/bg1.jpg');
    background-size: cover;
}

.container {
    position: relative;
    max-width: 70%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-template-rows: minmax(100px, auto);
    margin: 40px;
    grid-auto-flow: dense;
    grid-gap: 10px;
    cursor: pointer;
}

.container .box {
    background: #71717189;
    padding: 20px;
    display: grid;
    font-size: 20px;
    place-items: center;
    text-align: center;
    color: #fff;
    transition: 0.5s;
    border-radius: 10px;
}

.container .box:hover {
    background: #f32828ac;
}

.container .box i {
    position: relative;
    color: white;
    margin-bottom: 10px;
}

.container .box p {
    font-weight: bold;
    color: white;
    text-transform: uppercase;
}

.container .box:nth-child(1) {
    grid-column: span 2;
    grid-row: span 1;
    background: #6b92ec72;
}

.container .box:nth-child(1):hover {
    background: #f328a5ac;
}

.container .box:nth-child(2) {
    background: #4842045c;
}

.container .box:nth-child(2):hover {
    background: #f328a5ac;
}

.container .box:nth-child(4) {
    background: #6094f564;
}

.container .box:nth-child(4):hover {
    background: #f328a5ac;
}

.container .box:nth-child(3) {
    grid-column: span 1;
    grid-row: span 2;
    background: #94040494;
}

.container .box:nth-child(3):hover {
    background: #f328a5ac;
}

.container .box:nth-child(5) {
    grid-column: span 1;
    grid-row: span 2;
    background: rgba(65, 111, 27, 0.719);
}

.container .box:nth-child(5):hover {
    background: #f328a5ac;
}

.container .box:nth-child(7) {
    grid-column: span 2;
    grid-row: span 1;
    background: #19491888;
}

.container .box:nth-child(7):hover {
    background: #f328a5ac;
}

.container .box:nth-child(8) {
    grid-column: span 1;
    grid-row: span 2;
    background: rgba(91, 14, 86, 0.606);
}

.container .box:nth-child(8):hover {
    background: #f328a5ac;
}

.container .box:nth-child(9) {
    grid-column: span 2;
    grid-row: span 1;
    background: rgba(170, 75, 2, 0.554);
}

.container .box:nth-child(9):hover {
    background: #f328a5ac;
}

@media(max-width: 891px) {
    .container {
        grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
        grid-template-rows: minmax(auto, auto);
    }

    .container .box {
        grid-column: unset !important;
        grid-row: unset !important;
    }
}</style>