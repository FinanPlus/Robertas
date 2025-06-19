document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('chatbot-container');
    const toggleBtn = document.getElementById('chatbot-toggle');
    const minimizeBtn = document.getElementById('minimize-chat');
    const closeBtn = document.getElementById('close-chat');
    const messagesContainer = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickQuestionsContainer = document.getElementById('quick-questions');

    let isOpen = false;
    let isTyping = false;
    let isMinimized = false;
    let hasWelcomed = false;

    const questionsData = {
        Dudas: "¿Tienes alguna duda o alguna sugerencia?, ¡CONTÁCTANOS!",
        mascotas: "¿Puedo llevar a mi mascota?",
        llegar: "¿Cómo llego a las cabañas?",
        servicios: "¿Qué servicios incluyen?",
        cancelacion: "¿Cuál es su política de cancelación?",
        actividades: "¿Qué actividades hay cerca?"
    };

    const responses = {
        mascotas: [
            "¡Sí! Aceptamos mascotas 🐕. Puedes traer hasta 2 por cabaña con un costo adicional de $200 por noche.",
            "¡Claro! Somos pet friendly 🐾. Las mascotas deben estar supervisadas y no subirse a los muebles."
        ],
        llegar: [
            "Estamos en Zacatlán, Puebla. Usa Google Maps y busca Roberta’s Cabañas 📍. ¿Te comparto el enlace directo?",
            "Toma la carretera a Zacatlán y sigue señales a la Barranca de los Jilgueros. ¡Te esperamos!"
        ],
        servicios: [
            "Nuestras cabañas incluyen: cocina, baño, sala con TV, WiFi, terraza, y estacionamiento.",
            "Te ofrecemos cocina equipada, fogatas, agua caliente, áreas verdes, terraza con vista 🍃"
        ],
        cancelacion: [
            "Política de cancelación: 15+ días antes = 80% reembolso, 7-14 días = 50%, <7 días = no hay reembolso.",
            "Cancelaciones: más de 15 días: 80%; entre 7 y 14 días: 50%; menos de 7: sin reembolso."
        ],
        actividades: [
            "Puedes hacer senderismo, visitar el río, ir al mirador, probar sidra local, o recorrer huertos 🍎.",
            "Actividades recomendadas: caminatas, avistamiento de aves, picnic, visita a viñedos, y más 🌲."
        ]
    };

    function addMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = isUser ? 'message user-message' : 'message bot-message';
        msg.innerHTML = isUser ? text : text.replace(/\n/g, "<br>");
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
        isTyping = true;
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typing;
    }

    function hideTyping(el) {
        if (el && el.remove) el.remove();
        isTyping = false;
    }

    function processQuestion(input) {
        const q = input.toLowerCase();

        const patterns = [
            { key: "mascotas", regex: /(aceptan|permiten|puedo llevar|traer).*(mascota|perro|gato|animal)/ },
            { key: "llegar", regex: /(cómo|como|dónde|donde).*(llego|ubicación|encuentran|ir|direccion)/ },
            { key: "servicios", regex: /(qué|que|cuáles).*(incluye|incluyen|servicios|comodidades|instalaciones)/ },
            { key: "cancelacion", regex: /(cancelación|cancelar|reembolso|cambio de fecha|política|políticas)/ },
            { key: "actividades", regex: /(actividades|diversión|hacer|entretenimiento|recomiendan)/ }
        ];

        for (const { key, regex } of patterns) {
            if (regex.test(q)) {
                const options = responses[key];
                return Array.isArray(options)
                    ? options[Math.floor(Math.random() * options.length)]
                    : options;
            }
        }

        // ❌ No coincidió con ninguna pregunta conocida
        return null;
    }

    function handleUserInput(inputText) {
        addMessage(inputText, true);
        const typingEl = showTyping();
        setTimeout(() => {
            hideTyping(typingEl);
            const reply = processQuestion(inputText);

            if (reply) {
                addMessage(reply);
            } else {
                // 📩 Mensaje personalizado si no se entiende la pregunta
                addMessage("Parece que tu pregunta no está entre las opciones frecuentes. Escríbenos por WhatsApp aquí: <a href='https://wa.me/525559024785' target='_blank'>https://wa.me/525559024785</a>");
            }
        }, 1000);
    }

    sendBtn.addEventListener('click', () => {
        const val = userInput.value.trim();
        if (val && !isTyping) {
            userInput.value = '';
            handleUserInput(val);
        }
    });

    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendBtn.click();
    });

    minimizeBtn.addEventListener('click', e => {
        e.stopPropagation();
        isMinimized = !isMinimized;
        container.classList.toggle('minimized', isMinimized);
    });

    closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        isOpen = false;
        container.classList.remove('active');
    });

    document.getElementById('chatbot-header').addEventListener('click', () => {
        if (isMinimized) {
            container.classList.remove('minimized');
            isMinimized = false;
        }
    });

    // Crear botones rápidos
    if (quickQuestionsContainer.children.length === 0) {
        for (const key in questionsData) {
            const btn = document.createElement('button');
            btn.className = 'quick-btn';
            btn.textContent = questionsData[key];
            btn.setAttribute('data-query', key);
            btn.addEventListener('click', () => {
                if (!isTyping) handleUserInput(questionsData[key]);
            });
            quickQuestionsContainer.appendChild(btn);
        }
    }

    // Mostrar el chatbot automáticamente después de 2 segundos
    setTimeout(() => {
        container.classList.add('active');
        isOpen = true;
        if (!hasWelcomed) {
            hasWelcomed = true;
        }
    }, 2000);
});
