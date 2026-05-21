import { useState, useCallback, useEffect, useRef } from "react";

const ALL_QUESTIONS = [
  { id:1, category:"DAN 151", question:"Además de los requisitos técnicos de la norma DAN 151 para vuelos en zonas urbanas se deberá cumplir con:\nI. Sólo se podrá volar hasta 30 metros medidos horizontalmente de una persona ajena a la operación.\nII. Solo se podrá operar en condiciones BVLOS.\nIII. Para vuelos encima de 120 mts (400 pies) se deberá obtener previamente autorización de la DGAC.", options:["Solo I y II.","Solo II y III.","Solo I y III.","I, II y III."], correct:2, explanation:"Solo I y III son correctas. La condición BVLOS NO está permitida en zonas urbanas sin autorización especial." },
  { id:2, category:"DAN 91", question:"¿Cuál de las siguientes afirmaciones NO está prohibida según la DAN 91?", options:["Poner en riesgo la vida e integridad de las personas.","Poner en riesgo la propiedad pública o privada.","Operar en forma descuidada o temeraria, poniendo en riesgo a otras aeronaves.","Operar fuera de áreas pobladas con autorización de la DGAC."], correct:3, explanation:"Operar fuera de áreas pobladas con autorización de la DGAC es una operación permitida." },
  { id:3, category:"DAN 151", question:"¿Cuáles son los pasos para obtener permiso de vuelo RPAS sobre área poblada con centros urbanos y asentamientos habitacionales?", options:["Sólo con el permiso del dueño del lugar.","Permiso del dueño o administrador e informar al centro de control de tránsito aéreo.","Enviar formulario de solicitud, carta del dueño del lugar, KMZ del área a sobrevolar.","Enviar formulario según DAN 119, carta del dueño, KMZ, registro de aeronave, credencial RPAS y póliza de seguro o resolución JAC."], correct:3, explanation:"El proceso completo requiere: formulario según DAN 119, carta del propietario, KMZ, registro, credencial RPAS y póliza de seguro o resolución JAC." },
  { id:4, category:"DAN 151", question:"¿Cuál es uno de los requisitos fundamentales para operar en áreas pobladas según DAN 151?", options:["El peso máximo del RPA debe ser de hasta 19 kg incluyendo accesorios.","El RPA debe haber sido construido desde diferentes kits de distintos fabricantes.","El RPA debe contar con paracaídas de emergencia durante su operación.","El RPA debe ser volado solo en forma autónoma."], correct:2, explanation:"El RPA debe contar con paracaídas de emergencia para mitigar riesgos en áreas pobladas." },
  { id:5, category:"Código Aeronáutico", question:"De acuerdo al Art. 82 del Código Aeronáutico, quedan prohibidas todas las operaciones de vuelos RPAS de cualquier peso sobre:", options:["Áreas densamente pobladas como centros urbanos o similares.","Instalaciones militares, bases aéreas de las FF.AA., instalaciones carcelarias e instalaciones estratégicas del Estado de Chile.","Sobre aglomeración de personas al aire libre como conciertos o festivales.","Sobre parques nacionales y áreas protegidas."], correct:1, explanation:"El Art. 82 prohíbe expresamente operar sobre instalaciones militares, bases aéreas FF.AA., instalaciones carcelarias e instalaciones estratégicas del Estado." },
  { id:6, category:"DAN 151", question:"Dentro de los requisitos técnicos exigidos a un RPA está:", options:["La aeronave debe haber sido construida de un kit de fábrica y contar con instructivos técnicos de operación.","Contar solo con motores eléctricos.","Puede ser armado de piezas de diferentes fabricantes y no requerir instructivos técnicos.","Ser de estructura metálica y partes plásticas."], correct:0, explanation:"El RPA debe haber sido construido de un kit de fábrica y contar con instructivos técnicos de operación." },
  { id:7, category:"DAN 151", question:"Durante la operación de una aeronave pilotada a distancia quedará prohibido:\nI. Operar en zonas prohibidas y peligrosas publicadas por la DGAC.\nII. Operar más de un RPA en forma simultánea.\nIII. Violar los derechos de otras personas en su privacidad e intimidad.", options:["Solo I.","Solo I y II.","Solo I y III.","I, II y III."], correct:3, explanation:"Las tres afirmaciones son prohibiciones durante la operación de un RPAS." },
  { id:8, category:"DAN 151", question:"Durante el vuelo, el operador RPAS debe salvar obstáculos y personas no involucradas con un margen vertical de ___ mts y separación horizontal de ___ mts.", options:["10 y 20.","20 y 30.","30 y 20.","20 y 10."], correct:1, explanation:"El margen vertical requerido es de 20 metros y la separación horizontal de 30 metros." },
  { id:9, category:"Aerodinámica", question:"El ángulo de ataque es:", options:["El ángulo formado entre la cuerda aerodinámica y la dirección del viento relativo.","El ángulo con el cual sube más deprisa el avión.","El ángulo formado entre el horizonte y el viento relativo.","El ángulo formado entre el borde de fuga y el viento relativo."], correct:0, explanation:"El ángulo de ataque es el ángulo formado entre la cuerda aerodinámica del ala y la dirección del viento relativo." },
  { id:10, category:"Aerodinámica", question:"El camino seguido por una aeronave durante su desplazamiento por el aire se denomina:", options:["Aerovía.","Viento relativo.","Trayectoria de vuelo.","Trayectoria."], correct:2, explanation:"La trayectoria de vuelo es el camino seguido por la aeronave en el espacio aéreo." },
  { id:11, category:"Meteorología", question:"METAR SCVD 211400Z 12003KT 4000 VCFG BKN020 04/03 Q1026=\nLa visibilidad está restringida por:", options:["Niebla.","Niebla baja.","Niebla en la vecindad.","Niebla en bancos."], correct:2, explanation:"VCFG = Vicinity Fog = Niebla en la vecindad. VC indica que el fenómeno ocurre en la vecindad del aeródromo." },
  { id:12, category:"Aerodinámica", question:"El movimiento alrededor del eje lateral se denomina:", options:["Alabeo.","Cabeceo.","Pérdida.","Ganancia."], correct:1, explanation:"El cabeceo (pitch) es el movimiento rotacional alrededor del eje lateral de la aeronave." },
  { id:13, category:"DAN 151", question:"El peso máximo de despegue de un RPA de acuerdo a la norma DAN 151 debe ser de hasta:", options:["6 kilos.","8 kilos.","9 kilos.","7 kilos."], correct:2, explanation:"Según la DAN 151, el peso máximo de despegue permitido para un RPA es de hasta 9 kilogramos." },
  { id:14, category:"DAN 151", question:"El plazo para enviar las solicitudes de operación según Anexo D de la DAN 91 y apéndice A de la DAN 151 es de:", options:["10 días hábiles.","5 días hábiles.","15 días hábiles.","7 días hábiles."], correct:0, explanation:"Las solicitudes de operación deben enviarse con un plazo de 10 días hábiles de anticipación." },
  { id:15, category:"Normativa", question:"En caso de incumplimiento de la normativa aeronáutica, la DGAC aplicará lo establecido en:", options:["DAR 13.","DAR 06.","DAR 51.","DAR 61."], correct:2, explanation:"El DAR 51 regula las sanciones por incumplimiento de la normativa aeronáutica." },
  { id:16, category:"Código Penal", question:"El Art. 161-a del Código Penal establece que quien, sin autorización, capte imágenes o grabe conversaciones en recintos privados, será castigado con:", options:["Con presidio menor.","Sólo una multa, dependiendo de la infracción.","Con reclusión menor en cualquiera de sus grados y multa de 50 a 500 UTM.","Una multa determinada por la sección infraccional de la DGAC."], correct:2, explanation:"El Art. 161-a establece reclusión menor en cualquiera de sus grados más multa de 50 a 500 UTM." },
  { id:17, category:"Meteorología", question:"En METAR, la abreviatura NIL significa:", options:["Estación cerrada.","Instrumentos fuera de servicio.","Reparación de instalaciones.","Estación ausente o datos faltantes."], correct:3, explanation:"NIL en un METAR indica que la estación está ausente o que los datos están faltantes." },
  { id:18, category:"Meteorología", question:"METAR SCCI 160800Z 29014G24KT 9999 FEW013 01/M03 Q0985 NOSIG\n¿Cuál es la racha máxima del viento informado?", options:["29 kt.","24 kt.","14 kt.","01 kt."], correct:1, explanation:"29014G24KT: dirección 290°, velocidad media 14 kt, ráfaga (G) máxima de 24 kt." },
  { id:19, category:"DAN 151", question:"¿En qué condiciones se exceptúa el control manual del RPA según DAN 151?\nI. Operaciones especiales con fines fotogramétricos.\nII. Operaciones de vigilancia aérea nocturna.\nIII. Aspersión agrícola.\nIV. Operaciones con sensores LIDAR o similares.", options:["Solo II y IV.","Solo I, II y IV.","Solo I, III, IV.","I, II, III y IV."], correct:2, explanation:"Se exceptúa el control manual en: fotogrametría, aspersión agrícola y sensores LIDAR. La vigilancia nocturna no está incluida." },
  { id:20, category:"Aerodinámica", question:"En un vuelo recto y nivelado, sin aceleración o deceleración, las fuerzas equilibradas son:", options:["La sustentación igual al empuje.","La sustentación distinta al empuje.","La sustentación distinta al peso.","La sustentación igual al peso."], correct:3, explanation:"En vuelo recto y nivelado a velocidad constante, la sustentación es igual al peso." },
  { id:21, category:"DAN 91", question:"Es la operación en la cual la tripulación remota mantiene contacto visual directo con la aeronave para dirigir su vuelo y satisfacer responsabilidades de separación y anticolisión:", options:["Operación de vuelo.","Operación con visibilidad directa visual (VLOS).","Operación más allá de la visibilidad directa visual (BVLOS).","Operación visual."], correct:1, explanation:"VLOS: el piloto mantiene contacto visual directo con la aeronave en todo momento." },
  { id:22, category:"DAN 91", question:"Espacio aéreo sobre el territorio de Chile donde está prohibido el vuelo de aeronaves por razones de seguridad nacional se denomina:", options:["Zona restringida.","Zona peligrosa.","Zona insegura.","Zona prohibida."], correct:3, explanation:"La zona prohibida es el espacio aéreo donde el vuelo está completamente prohibido por razones de seguridad nacional." },
  { id:23, category:"Meteorología", question:"Gradiente vertical de temperatura se define como:", options:["La variación de la temperatura con la altura.","El cambio de temperatura a lo largo del día.","La variación de presión con la temperatura.","El cambio de la dirección del viento."], correct:0, explanation:"El gradiente vertical de temperatura describe cómo cambia la temperatura en función de la altitud." },
  { id:24, category:"Meteorología", question:"La abreviatura BCFG usada en claves meteorológicas del METAR significa:", options:["Niebla.","Niebla baja.","Niebla en la vecindad.","Niebla en bancos."], correct:3, explanation:"BCFG = Banco de Niebla (BC = en bancos, FG = fog)." },
  { id:25, category:"DAN 151", question:"La altura máxima de operación de un RPA según la DAN 151 es:", options:["400 pies.","400 mts.","450 pies.","120 pies."], correct:0, explanation:"La altura máxima de operación es de 400 pies (~120 metros) sobre el nivel del suelo." },
  { id:26, category:"DAN 151", question:"La autorización emitida por la DGAC para operar en áreas pobladas según DAN 151 tiene validez de ___ meses:", options:["6.","2.","3.","12."], correct:0, explanation:"La autorización de la DGAC para operar en áreas pobladas tiene validez de 6 meses." },
  { id:27, category:"Meteorología", question:"La brisa marina está originada por:", options:["El oleaje del mar.","El amanecer y el atardecer del día.","La mayor humedad de la superficie del mar.","La diferencia térmica entre el mar y la tierra."], correct:3, explanation:"La brisa marina se origina por la diferencia de temperatura entre la tierra y el mar." },
  { id:28, category:"Meteorología", question:"La capa de la atmósfera en la cual se desarrollan las actividades de los RPAS se denomina:", options:["Estratosfera.","Tropósfera.","Tropopausa.","Exosfera."], correct:1, explanation:"Los RPAS operan en la tropósfera, la capa más baja de la atmósfera." },
  { id:29, category:"DAN 151", question:"La credencial de RPA permite al portador:", options:["Desempeñarse como operador de RPAS solo en condiciones VLOS.","Desempeñarse como operador de RPAS en condición BVLOS.","Desempeñarse como operador de RPAS en cualquier condición.","a) y b)."], correct:0, explanation:"La credencial básica solo habilita para operar en condiciones VLOS." },
  { id:30, category:"DAN 151", question:"La definición de 'áreas pobladas' es:", options:["Zonas destinadas para espectáculos de congregación masiva de personas.","Zonas en las que se desarrollen actividades que convoquen aglomeración de personas al aire libre.","Terrenos destinados para ser habitados por poblaciones humanas.","Zonas en las que existan centros urbanos o se desarrollen actividades que convoquen aglomeración de personas al aire libre."], correct:3, explanation:"Áreas pobladas incluye tanto centros urbanos como lugares donde se convoque aglomeración de personas al aire libre." },
  { id:31, category:"Normativa", question:"La definición de Nivel Aceptable de Seguridad Operacional (ALOS) corresponde a:", options:["Nivel o criterio fuera del intervalo normal que dispara una alerta.","Nivel mínimo de rendimiento en materia de seguridad operacional expresado en objetivos e indicadores.","Responde al análisis permanente de los acontecimientos al interior del proveedor de servicios.","Objetivos de mediano y largo plazo establecidos en términos numéricos."], correct:1, explanation:"El ALOS es el nivel mínimo de rendimiento en seguridad operacional expresado en objetivos e indicadores." },
  { id:32, category:"DAN 151", question:"'Persona designada por el explotador para operar los controles de vuelo de una aeronave pilotada a distancia durante el tiempo de vuelo.' Corresponde al concepto de:", options:["Piloto.","Explorador.","Piloto a distancia.","Explotador a distancia."], correct:2, explanation:"El piloto a distancia es la persona designada para operar los controles de vuelo del RPA." },
  { id:33, category:"DAN 151", question:"'Una operación durante la cual una aeronave pilotada a distancia vuela sin intervención de piloto en la gestión de vuelo.' Corresponde al concepto de:", options:["Operación restringida.","Operación con visibilidad directa visual.","Operación en gestión de vuelo.","Operación autónoma."], correct:3, explanation:"Operación autónoma: el RPA vuela sin intervención del piloto en la gestión del vuelo." },
  { id:34, category:"Meteorología", question:"La dirección de la brisa marina por la noche es:", options:["Del mar hacia la tierra.","Paralelo a la costa.","Relativa.","De la tierra hacia el mar."], correct:3, explanation:"Por la noche, la tierra se enfría más rápido, el viento sopla de la tierra hacia el mar." },
  { id:35, category:"Aerodinámica", question:"La fuerza aerodinámica es:", options:["La fuerza paralela al viento relativo.","La fuerza resultante de la sustentación y la resistencia inducida.","La fuerza resultante de la fuerza centrífuga y el peso.","La fuerza resultante de la sustentación y el peso de la aeronave."], correct:1, explanation:"La fuerza aerodinámica total es la resultante de la sustentación y la resistencia inducida." },
  { id:36, category:"Aerodinámica", question:"La fuerza en dirección perpendicular hacia la superficie de la tierra se denomina:", options:["Empuje o tracción.","Sustentación.","Peso o gravedad.","Resistencia."], correct:2, explanation:"El peso o gravedad actúa perpendicularmente hacia el centro de la Tierra." },
  { id:37, category:"Meteorología", question:"La niebla se forma cuando:", options:["Existe aire húmedo y gran densidad.","Las nubes descienden hasta el nivel del suelo.","El aire se enfría por debajo de su punto de rocío.","El aire se calienta por encima de su punto de rocío."], correct:2, explanation:"La niebla se forma cuando el aire se enfría por debajo de su punto de rocío." },
  { id:38, category:"Meteorología", question:"La nube más peligrosa para desarrollar el vuelo es:", options:["NS.","CB.","SC.","CI."], correct:1, explanation:"El Cumulonimbus (CB) es la nube más peligrosa: tormentas, turbulencia severa, granizo." },
  { id:39, category:"Aerodinámica", question:"La resistencia inducida es:", options:["La que se produce debido a la sustentación.","La que proporciona mayor velocidad.","La suma de la gravedad más la resistencia parásita.","La que se produce debido al peso de la aeronave."], correct:0, explanation:"La resistencia inducida es un subproducto de la generación de sustentación." },
  { id:40, category:"Meteorología", question:"Las causas principales que originan las turbulencias son:", options:["Corrientes convectivas.","Obstrucciones al flujo del viento.","Cortante del viento.","Todas las anteriores."], correct:3, explanation:"Turbulencias por: corrientes convectivas, obstrucciones al flujo y cortante del viento." },
  { id:41, category:"Aerodinámica", question:"La sustentación es:", options:["La fuerza hacia arriba perpendicular al viento relativo que soporta el peso de la aeronave.","La fuerza aerodinámica más la resistencia parásita.","La fuerza perpendicular al viento relativo para realizar la tracción de la aeronave.","La fuerza aerodinámica que soporta el peso de la aeronave."], correct:0, explanation:"La sustentación es la fuerza aerodinámica perpendicular al viento relativo hacia arriba." },
  { id:42, category:"Meteorología", question:"La temperatura a la cual se alcanza el punto de saturación del vapor de agua se denomina:", options:["Punto de saturación.","Punto de rocío.","Temperatura de ebullición.","Temperatura de saturación."], correct:1, explanation:"El punto de rocío es la temperatura a la que el aire debe enfriarse para alcanzar la saturación." },
  { id:43, category:"Meteorología", question:"La temperatura de la atmósfera estándar a nivel del mar es de:", options:["25° C.","15° C.","50° C.","0° C."], correct:1, explanation:"Según la ISA (Atmósfera Estándar Internacional), la temperatura a nivel del mar es de 15°C." },
  { id:44, category:"Meteorología", question:"La turbulencia mecánica se crea:", options:["Por las térmicas de calor.","Por las ráfagas de viento.","Por el rozamiento del aire con la superficie.","Por la relación entre ráfagas de viento y térmicas de calor."], correct:2, explanation:"La turbulencia mecánica se produce por el rozamiento del viento con obstáculos o la superficie." },
  { id:45, category:"Código Aeronáutico", question:"Las sanciones del Código Aeronáutico Art. 185 son:\nI. Amonestación escrita.\nII. Multas de 5 a 500 ingresos mínimos.\nIII. Suspensión de permisos y licencias hasta por 3 años.\nIV. Cancelación definitiva de permisos o licencia.", options:["Solo I, II y IV.","Solo II y IV.","Solo I, II y III.","I, II, III y IV."], correct:3, explanation:"El Art. 185 contempla todas: amonestación, multas, suspensión hasta 3 años y cancelación definitiva." },
  { id:46, category:"Meteorología", question:"METAR SCVD 211400Z 12003KT 0500 VCDG BKN 020 04/03 Q1026 NOSIG\nLa temperatura del punto de rocío es:", options:["5 grados.","4 grados.","3 grados.","Ninguna de las anteriores."], correct:2, explanation:"En el METAR, 04/03 = temperatura 4°C / punto de rocío 3°C." },
  { id:47, category:"Meteorología", question:"METAR SCVD 211400Z 12003KT 0500 VCFG BKN 020 04/03 Q1026 NOSIG\nLa visibilidad es de:", options:["1400 metros.","500 metros.","0.5 MN.","Ninguna de las anteriores."], correct:1, explanation:"El grupo 0500 en el METAR indica visibilidad de 500 metros." },
  { id:48, category:"Meteorología", question:"METAR SCVD 211400Z 12003KT 4000 VCFG BKN 020 04/03 Q1026 NOSIG\nLa dirección e intensidad del viento es:", options:["020 grados con 04 nudos.","211 grados con 40 nudos.","120 grados con 03 nudos.","040 grados con 03 nudos."], correct:2, explanation:"12003KT = dirección 120° (del SE) a 03 nudos de velocidad." },
  { id:49, category:"Código Aeronáutico", question:"Ninguna aeronave pilotada a distancia se utilizará sobre el _____ de otro estado sin la previa _____ especial concedida por ese estado.", options:["Derecho, convalidación.","Territorio, convalidación.","Derecho, autorización.","Territorio, autorización."], correct:3, explanation:"Las aeronaves no pueden operar sobre el territorio de otro estado sin previa autorización especial." },
  { id:50, category:"DAN 151", question:"No se podrá operar un RPA a:", options:["Menos de 2,5 km del eje de la pista y a 2 km paralelo al eje de un aeródromo.","Menos de 1 km del eje de la pista y a 500 m paralelo al eje de un aeródromo.","Menos de 1,5 km del eje de la pista y a 1 km paralelo al eje de un aeródromo.","Menos de 2 km de la prolongación del eje de pista desde el umbral y menos de 1 km paralelo al eje de la pista de un aeródromo."], correct:3, explanation:"Prohibido a menos de 2 km de la prolongación del eje de pista y a menos de 1 km paralelo al eje." },
  { id:51, category:"DAN 151", question:"Para la correcta planificación de un vuelo RPAS, el operador deberá:\nI. Verificar plataforma IFIS y NOTAMS vigentes.\nII. Verificar condiciones meteorológicas vía METAR.\nIII. Verificar aeródromos cercanos para la solicitud de vuelo.\nIV. Avisar a la municipalidad del área a operar.", options:["Solo I y IV.","Solo I, II y IV.","Solo I, II y III.","I, II, III y IV."], correct:2, explanation:"Los pasos correctos son I, II y III. No existe obligación de avisar a la municipalidad." },
  { id:52, category:"DAN 151", question:"Para la obtención y revalidación de la credencial se deberá aprobar un examen escrito sobre:", options:["DAN 151, DAN 91, NOTAMS, meteorología y aerodinámica.","DAN 151, meteorología, aerodinámica y operaciones aéreas.","DAN 151, MOTAMS, meteorología y operaciones aéreas.","DAN 151, DAN 91, meteorología, aerodinámica y operaciones aéreas."], correct:3, explanation:"El examen cubre: DAN 151, DAN 91, meteorología, aerodinámica y operaciones aéreas." },
  { id:53, category:"Meteorología", question:"Para que la formación de niebla sea probable, debe existir:", options:["Nubes en altura y corrientes descendentes de aire húmedo.","Fuerte viento y alta humedad relativa a nivel del suelo.","Alta humedad, temperatura y punto de rocío próximo y viento en calma.","Nubes en altura y fuerte viento."], correct:2, explanation:"La niebla se forma con alta humedad, temperatura cercana al punto de rocío y viento en calma." },
  { id:54, category:"DAN 151", question:"Para un vuelo recreacional en área poblada NO se requiere permiso de la DGAC:", options:["Si la aeronave es de polietileno expandido y/o material equivalente sin importar su peso.","Si la aeronave es de polietileno expandido y/o material equivalente solo si pesa hasta 750 gramos.","Sólo si la aeronave es de polietileno expandido (plumavit).","Solo si pesa menos de 750 gramos."], correct:1, explanation:"No se requiere permiso DGAC si la aeronave es de polietileno expandido Y pesa máximo 750 gramos." },
  { id:55, category:"Meteorología", question:"¿Qué es necesario para que se produzcan precipitaciones?", options:["Que la temperatura ambiente sea elevada.","Que la presión atmosférica sea alta.","Que el aire esté saturado.","Que el aire esté contaminado."], correct:2, explanation:"Para precipitaciones el aire debe estar saturado al 100% de humedad relativa." },
  { id:56, category:"Normativa", question:"¿Qué se entiende por seguridad operacional?", options:["Estado en que el riesgo de lesiones o daños se reduce y mantiene en nivel aceptable mediante proceso continuo de identificación de peligros y gestión de riesgos.","Estado en que el riesgo de lesiones aumenta, mediante proceso discontinuo de identificación de peligros.","Concepto que solo se ocupa en Chile respecto a la seguridad de las aeronaves.","Parámetro de seguridad para observar y evaluar el rendimiento en materia de riesgo operacional."], correct:0, explanation:"Seguridad operacional: el riesgo se reduce mediante un proceso CONTINUO de identificación de peligros." },
  { id:57, category:"DAN 151", question:"¿Quién es el responsable de la conducción segura de las operaciones según la normativa DAN 151?", options:["El explotador.","El dueño de la empresa.","La DGAC.","El piloto a distancia."], correct:3, explanation:"Según la DAN 151, el piloto a distancia es el responsable directo de la conducción segura." },
  { id:58, category:"Meteorología", question:"Se define como ráfaga:", options:["El valor de la intensidad del viento cuando es constante.","La turbulencia creada por la intensidad del viento.","La turbulencia creada al sotavento de una montaña.","El valor máximo de la intensidad del viento cuando no es constante."], correct:3, explanation:"La ráfaga es el valor máximo de la velocidad del viento en períodos de variación no constante." },
  { id:59, category:"Meteorología", question:"Se dice que el aire está saturado cuando:", options:["No se puede comprimir más.","No admite mayor cantidad de vapor de agua.","Su tensión de vapor es mínima.","Presenta máxima densidad."], correct:1, explanation:"Aire saturado = máxima cantidad posible de vapor de agua a esa temperatura (HR = 100%)." },
  { id:60, category:"Meteorología", question:"Se dice que el viento es constante cuando:", options:["Unas veces lleva un sentido y en otras ocasiones otro.","Su acción es constante y en la misma dirección.","Su acción es constante, pero puede variar su dirección.","Se desplaza en una sola dirección."], correct:1, explanation:"El viento constante mantiene tanto su velocidad como su dirección de manera sostenida." },
  { id:61, category:"DAN 151", question:"Según la DAN 151, la información técnica para inscribir la aeronave incluye:\nI. Fabricante, país.\nII. Marca, modelo y número de serie.\nIII. Color y tipo de material de la aeronave.\nIV. Peso de fábrica.", options:["Solo I y II.","Solo I, II y III.","Solo I, II y IV.","I, II, III y IV."], correct:3, explanation:"Para inscribir un RPA: fabricante, país, marca, modelo, número de serie, color, tipo de material y peso de fábrica." },
  { id:62, category:"DAN 151", question:"Según la norma DAN 151, la duración de la credencial de operador de RPA será de:", options:["12 meses.","24 meses.","36 meses.","6 meses."], correct:1, explanation:"La credencial de operador RPA tiene duración de 24 meses, luego debe ser revalidada." },
  { id:63, category:"DAN 151", question:"Según la DAN 151, uno de los requisitos para obtener la credencial de operador RPAS es:", options:["Tener menos de 18 años.","Aprobar el examen escrito solo de materias de normativa aeronáutica.","Presentar declaración jurada simple con huella digital de haber recibido instrucción teórica y práctica, con certificado de la empresa instructora.","Obtener calificación mínima de aprobación de 70%."], correct:2, explanation:"Se requiere declaración jurada simple con huella digital y certificado de la empresa instructora." },
  { id:64, category:"DAN 151", question:"Según la DAN 151, un piloto a distancia durante la operación de un RPA NO podrá:\nI. Operar más de un RPA simultáneamente.\nII. Operar bajo la influencia de drogas o alcohol.\nIII. Operar en áreas donde se combate un incendio con aeronaves tripuladas.\nIV. Operar a menos de 1 km del eje de pista y a menos de 2 km paralelo al eje.", options:["Solo I, II y III.","Solo II, III y IV.","Solo I, III y IV.","I, II, III y IV."], correct:3, explanation:"Todas las restricciones son correctas." },
  { id:65, category:"DAN 151", question:"Según la DAN 151, un piloto a distancia durante la operación de un RPA PODRÁ:", options:["Operar en zonas prohibidas y peligrosas publicadas por la DGAC.","Operar en zonas restringidas sin autorización de la DGAC.","Operar en la noche con una autorización especial de la DGAC.","Operar sin tomar conocimiento de los NOTAMS vigentes publicados por la DGAC."], correct:2, explanation:"El piloto puede operar de noche con autorización especial de la DGAC." },
  { id:66, category:"Meteorología", question:"METAR SCIE 161500Z 02005KT CAVOK 12/07 Q1018=\nLa abreviatura CAVOK determina que la visibilidad, el tiempo presente y las nubes son:", options:["Ilimitada; sin precipitaciones; sin CB ni nubes bajo la altitud mínima del sector.","Superior a 10 km; sin precipitaciones significativas; sin nubes bajo 1500 ft ni CB.","Superior a 5 km; despejado; sin CB.","Superior a 10 km; cielo despejado; sin restricciones."], correct:1, explanation:"CAVOK: visibilidad > 10 km, sin precipitaciones significativas, sin nubes bajo 1500 ft y sin CB." },
  { id:67, category:"DAN 151", question:"Para la inscripción del RPA se requiere acreditar que la aeronave es capaz de:", options:["Volar de manera autónoma sin intervención del piloto.","Mantener la posición GPS con precisión de 1 metro.","Interrumpir el vuelo de forma segura ante falla del enlace de mando y control.","Transmitir video en tiempo real a la estación de control."], correct:2, explanation:"El RPA debe interrumpir el vuelo de forma segura ante la falla del enlace de mando y control." },
];

const CATEGORIES = ["Todas", ...Array.from(new Set(ALL_QUESTIONS.map(q => q.category)))];
const EXAM_SIZE = 20;
const PASS_SCORE = 70;
const CAT_COLOR = { "DAN 151":"#3b82f6","DAN 91":"#8b5cf6","Meteorología":"#06b6d4","Aerodinámica":"#10b981","Normativa":"#f59e0b","Código Aeronáutico":"#ef4444","Código Penal":"#ec4899" };
const CAT_ICON  = { "DAN 151":"📋","DAN 91":"✈️","Meteorología":"🌤","Aerodinámica":"🌀","Normativa":"⚖️","Código Aeronáutico":"🛡️","Código Penal":"⚠️" };
const BIBLIO = [
  { icon:"📄", title:"DAN 151 — Ed. 3 / May 2024", desc:"Operaciones de Aeronaves Pilotadas a Distancia (RPAS)", url:"https://www.dgac.gob.cl/wp-content/uploads/2024/05/DAN-151-ED3-27MAY2024.pdf" },
  { icon:"✈️", title:"DAN 91 — Ed. 4 / Enm. 5 / Jul 2023", desc:"Reglas del Aire — DGAC Chile", url:"https://www.dgac.gob.cl/wp-content/uploads/2023/07/DAN-91_ED4__ENM5_20JUL2023-1.pdf" },
  { icon:"📘", title:"Código Aeronáutico — Ley 18.916", desc:"Ministerio de Justicia y DDHH, 1990", url:"https://www.bcn.cl/leychile/navegar?idNorma=30006" },
  { icon:"⚖️", title:"DAR 51 — Procedimiento Infraccional", desc:"Reglamento de Sanciones Aeronáuticas", url:"https://www.dgac.gob.cl/wp-content/uploads/2017/07/dar51.pdf" },
  { icon:"🗺️", title:"NOTAM / IFIS Chile", desc:"Información aeronáutica en tiempo real", url:"https://www.dgac.gob.cl/servicios-en-linea/ifis/" },
  { icon:"🌦️", title:"METAR / TAF — AIP Chile", desc:"Información meteorológica aeronáutica", url:"https://aipchile.dgac.gob.cl/" },
  { icon:"📑", title:"Banco de Preguntas RPAS — Mar 2026", desc:"Preguntas oficiales para credencial RPAS", url:"https://www.dgac.gob.cl/wp-content/uploads/2026/03/Banco-de-preguntas-para-obtencion-de-credencial-RPAS-26MAR2026-web.pdf" },
  { icon:"🌐", title:"DGAC — Cómo operar un dron en Chile", desc:"Guía oficial para operadores RPAS", url:"https://www.dgac.gob.cl/como-operar-un-dron-en-chile/" },
];

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function useFadeIn(dep){const[vis,setVis]=useState(false);useEffect(()=>{setVis(false);const t=setTimeout(()=>setVis(true),30);return()=>clearTimeout(t);},[dep]);return vis;}

function AnimatedCounter({target,duration=1200}){
  const[val,setVal]=useState(0);const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){let s=0,step=target/60;const id=setInterval(()=>{s+=step;if(s>=target){setVal(target);clearInterval(id);}else setVal(Math.floor(s));},duration/60);obs.disconnect();}
    },{threshold:0.3});
    if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();
  },[target,duration]);
  return <span ref={ref}>{val}</span>;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#0a0f1a;color:#e2e8f0;font-family:'Inter',-apple-system,sans-serif;}
a{color:inherit;text-decoration:none;}

@keyframes fadeUp   {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes scaleIn  {from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spinSlow {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes orbFloat {0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-52%) scale(1.04)}}
@keyframes correctPop{0%{transform:scale(1)}40%{transform:scale(1.035)}100%{transform:scale(1)}}
@keyframes wrongShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@keyframes barFill  {from{width:0}to{width:var(--w)}}
@keyframes dotPing  {0%{transform:scale(1);opacity:1}80%,100%{transform:scale(2.2);opacity:0}}
@keyframes countUp  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.navbar{position:sticky;top:0;z-index:200;height:60px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,15,26,0.9);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(30,58,95,0.7);animation:slideDown .4s ease both;}
.nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer;}
.nav-icon{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:18px;transition:transform .2s;}
.nav-icon:hover{transform:rotate(-8deg) scale(1.1);}
.nav-title{font-weight:800;font-size:17px;color:#fff;letter-spacing:-.3px;}
.nav-badge{font-size:11px;color:#64748b;background:#0f172a;border:1px solid #1e3a5f;border-radius:20px;padding:4px 12px;}

.hero{position:relative;overflow:hidden;background:linear-gradient(160deg,#0f172a 0%,#0d1b3e 55%,#0a0f1a 100%);border-bottom:1px solid #1e3a5f;padding:88px 32px 72px;text-align:center;}
.hero-orb{position:absolute;top:50%;left:50%;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(29,78,216,.14) 0%,transparent 68%);pointer-events:none;animation:orbFloat 7s ease-in-out infinite;}
.hero-orb2{position:absolute;top:20%;right:-10%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(6,182,212,.07) 0%,transparent 70%);pointer-events:none;animation:orbFloat 10s ease-in-out infinite reverse;}
.hero-icon-wrap{position:relative;display:inline-block;margin-bottom:24px;animation:fadeUp .7s .1s ease both;}
.hero-icon-wrap::before{content:'';position:absolute;inset:-14px;border-radius:50%;background:conic-gradient(from 0deg,#1d4ed8,#3b82f6,#06b6d4,#1d4ed8);animation:spinSlow 8s linear infinite;opacity:.3;}
.hero-icon-inner{position:relative;z-index:1;width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#1d4ed8,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:40px;}
.hero-title{font-size:clamp(36px,5vw,58px);font-weight:900;color:#fff;letter-spacing:-1.5px;line-height:1.05;margin-bottom:18px;animation:fadeUp .7s .2s ease both;}
.hero-title span{background:linear-gradient(90deg,#3b82f6,#06b6d4,#8b5cf6);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShift 4s ease infinite;}
.hero-sub{font-size:clamp(14px,1.8vw,18px);color:#94a3b8;max-width:560px;margin:0 auto 28px;line-height:1.65;animation:fadeUp .7s .3s ease both;}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:#0f2744;border:1px solid #1e3a5f;border-radius:24px;padding:7px 18px;font-size:12px;color:#94a3b8;animation:fadeUp .7s .4s ease both;}
.hero-badge-dot{position:relative;width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0;}
.hero-badge-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:#22c55e;animation:dotPing 2s ease-out infinite;}
.hero-cta{display:flex;gap:12px;justify-content:center;margin-top:36px;flex-wrap:wrap;animation:fadeUp .7s .5s ease both;}

.btn-primary{padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:none;font-weight:700;font-size:15px;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 24px rgba(37,99,235,.3);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,99,235,.45);}
.btn-primary:active{transform:scale(.97);}
.btn-outline{padding:14px 32px;border-radius:12px;background:transparent;color:#94a3b8;border:1.5px solid #1e3a5f;font-weight:600;font-size:15px;cursor:pointer;transition:all .15s;}
.btn-outline:hover{border-color:#3b82f6;color:#3b82f6;background:rgba(59,130,246,.06);}

.stats-bar{background:#0f172a;border-bottom:1px solid #1e3a5f;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
.stat-cell{background:#0f172a;padding:22px 24px;text-align:center;border-right:1px solid #1e3a5f;position:relative;overflow:hidden;}
.stat-cell:last-child{border-right:none;}
.stat-cell::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent,#3b82f6);transform:scaleX(0);transform-origin:left;transition:transform .6s ease;}
.stat-cell.vis::after{transform:scaleX(1);}
.stat-val{font-size:30px;font-weight:900;color:#fff;line-height:1;}
.stat-label{font-size:11px;color:#64748b;margin-top:5px;text-transform:uppercase;letter-spacing:.07em;}

.container{max-width:1140px;margin:0 auto;padding:0 32px;}
.main-grid{display:grid;grid-template-columns:1fr 360px;gap:28px;padding:40px 0 64px;align-items:start;}
@media(max-width:960px){.main-grid{grid-template-columns:1fr;}}

.card{background:#0f172a;border:1px solid #1e3a5f;border-radius:18px;overflow:hidden;transition:border-color .2s,box-shadow .2s;}
.card:hover{border-color:#1e4a7a;box-shadow:0 8px 40px rgba(0,0,0,.3);}
.card-header{padding:22px 26px 18px;border-bottom:1px solid #1e3a5f;display:flex;align-items:center;gap:14px;}
.card-header-icon{font-size:24px;}
.card-header-title{font-size:16px;font-weight:700;color:#fff;}
.card-header-sub{font-size:12px;color:#64748b;margin-top:3px;}
.card-body{padding:22px 26px;}

.mode-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
@media(max-width:600px){.mode-cards{grid-template-columns:1fr;}}
.mode-card{border-radius:16px;padding:22px;cursor:pointer;text-align:left;border:none;transition:transform .18s,box-shadow .18s;position:relative;overflow:hidden;}
.mode-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.06),transparent);opacity:0;transition:opacity .2s;}
.mode-card:hover{transform:translateY(-3px);}
.mode-card:hover::after{opacity:1;}
.mode-card:active{transform:scale(.98);}
.mode-card-exam{background:linear-gradient(135deg,#1d4ed8,#2563eb);box-shadow:0 4px 24px rgba(29,78,216,.3);}
.mode-card-exam:hover{box-shadow:0 8px 40px rgba(29,78,216,.45);}
.mode-card-study{background:#162032;border:1px solid #1e3a5f;}
.mode-card-study:hover{border-color:#3b82f6;box-shadow:0 4px 24px rgba(59,130,246,.1);}
.mode-emoji{font-size:30px;margin-bottom:12px;display:block;}
.mode-title{font-size:17px;font-weight:800;color:#fff;margin-bottom:6px;}
.mode-sub{font-size:13px;line-height:1.55;}
.mode-card-exam .mode-sub{color:#bfdbfe;}
.mode-card-study .mode-sub{color:#94a3b8;}

.cat-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.cat-pill{padding:7px 15px;border-radius:24px;font-size:12px;cursor:pointer;border:1px solid #1e3a5f;background:transparent;color:#94a3b8;transition:all .15s;font-weight:500;}
.cat-pill:hover{border-color:#334155;color:#e2e8f0;}
.cat-pill.active{font-weight:700;}

.cat-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #111827;cursor:pointer;transition:all .15s;border-radius:8px;}
.cat-row:last-child{border-bottom:none;}
.cat-row:hover{background:#111827;padding:12px 10px;margin:0 -10px;}
.cat-row-left{display:flex;align-items:center;gap:10px;}
.cat-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;transition:transform .15s;}
.cat-row:hover .cat-dot{transform:scale(1.5);}
.cat-name{font-size:14px;color:#cbd5e1;}
.cat-count{font-size:12px;color:#64748b;background:#0a0f1a;border:1px solid #1e3a5f;border-radius:12px;padding:3px 12px;}

.info-row{display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #111827;transition:transform .15s;}
.info-row:last-child{border-bottom:none;}
.info-row:hover{transform:translateX(3px);}
.info-icon{font-size:22px;flex-shrink:0;margin-top:2px;}
.info-ttl{font-size:13px;font-weight:700;color:#e2e8f0;}
.info-desc{font-size:12px;color:#64748b;margin-top:2px;line-height:1.45;}

.biblio-item{display:flex;align-items:flex-start;gap:12px;padding:10px 12px;border-radius:10px;border:1px solid transparent;text-decoration:none;color:inherit;transition:all .18s;position:relative;overflow:hidden;cursor:pointer;}
.biblio-item:hover{background:#111827;border-color:#1e3a5f;transform:translateX(4px);}
.biblio-icon{font-size:19px;flex-shrink:0;margin-top:1px;}
.biblio-title{font-size:13px;font-weight:700;color:#e2e8f0;}
.biblio-desc{font-size:11px;color:#64748b;margin-top:2px;}
.biblio-arrow{margin-left:auto;font-size:12px;color:#3b82f6;opacity:0;transition:opacity .15s,transform .15s;flex-shrink:0;align-self:center;}
.biblio-item:hover .biblio-arrow{opacity:1;transform:translateX(3px);}

.quiz-topbar{background:rgba(15,23,42,0.95);backdrop-filter:blur(12px);border-bottom:1px solid #1e3a5f;padding:12px 32px;position:sticky;top:60px;z-index:100;animation:slideDown .3s ease both;}
.quiz-topbar-inner{max-width:920px;margin:0 auto;}
.quiz-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.quiz-back{background:none;border:none;color:#64748b;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:color .15s;}
.quiz-back:hover{color:#e2e8f0;}
.quiz-cat-badge{border-radius:14px;padding:5px 14px;font-size:11px;font-weight:700;}
.quiz-counter{font-size:13px;color:#64748b;font-weight:600;}
.quiz-prog-track{height:5px;background:#1e3a5f;border-radius:5px;overflow:hidden;}
.quiz-prog-fill{height:100%;border-radius:5px;transition:width .5s cubic-bezier(.4,0,.2,1);}

.quiz-body{flex:1;display:flex;justify-content:center;padding:40px 32px;background:#0a0f1a;}
.quiz-inner{width:100%;max-width:920px;display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start;}
@media(max-width:800px){.quiz-inner{grid-template-columns:1fr;}}

.q-card{background:#0f172a;border:1px solid #1e3a5f;border-radius:18px;padding:30px;}
.q-card.anim{animation:fadeUp .35s ease both;}
.q-num{font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;font-weight:600;}
.q-text{font-size:16px;line-height:1.72;color:#e2e8f0;white-space:pre-line;margin-bottom:26px;}
.options{display:flex;flex-direction:column;gap:11px;}

.opt{display:flex;align-items:flex-start;gap:13px;padding:14px 18px;border-radius:14px;border:1.5px solid #1e3a5f;background:#0a0f1a;cursor:pointer;text-align:left;transition:border-color .15s,background .15s,transform .12s;position:relative;overflow:hidden;}
.opt::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);transition:left .4s;}
.opt:not(.answered):hover{border-color:#3b82f6;background:#0c1f3d;transform:translateX(4px);}
.opt:not(.answered):hover::after{left:100%;}
.opt.correct{background:#052e16;border-color:#16a34a;animation:correctPop .4s ease;}
.opt.wrong{background:#1c0f0f;border-color:#dc2626;animation:wrongShake .4s ease;}
.opt.muted{opacity:.45;}
.opt-letter{min-width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;margin-top:1px;transition:all .2s;}
.opt-text{font-size:14px;line-height:1.55;transition:color .15s;}
.opt.correct .opt-text{color:#86efac;}
.opt.wrong .opt-text{color:#fca5a5;}
.opt:not(.correct):not(.wrong) .opt-text{color:#cbd5e1;}

.expl{margin-top:18px;border-radius:14px;padding:16px 18px;animation:fadeUp .3s ease both;}
.expl.ok{background:#052e16;border:1px solid #16a34a;}
.expl.err{background:#1c0f0f;border:1px solid #dc2626;}
.expl p{font-size:13px;line-height:1.65;}
.expl.ok p{color:#86efac;}
.expl.err p{color:#fca5a5;}
.show-expl-btn{width:100%;padding:11px;border-radius:12px;margin-top:14px;background:transparent;border:1px solid #1e3a5f;color:#94a3b8;font-size:13px;cursor:pointer;transition:all .15s;}
.show-expl-btn:hover{border-color:#3b82f6;color:#3b82f6;background:rgba(59,130,246,.06);}
.quiz-next{width:100%;padding:15px;border-radius:14px;margin-top:18px;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:none;font-weight:700;font-size:15px;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 20px rgba(37,99,235,.25);animation:fadeUp .25s ease both;}
.quiz-next:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,99,235,.4);}

.quiz-side{background:#0f172a;border:1px solid #1e3a5f;border-radius:18px;padding:22px;position:sticky;top:140px;}
.side-label{font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.07em;margin-bottom:14px;font-weight:600;}
.q-dots{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;}
.q-dot{height:34px;border-radius:8px;background:#0a0f1a;border:1px solid #1e3a5f;font-size:11px;font-weight:700;color:#475569;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.q-dot.cur{border-color:#3b82f6;color:#3b82f6;background:#0c1f3d;transform:scale(1.08);}
.q-dot.ok{background:#052e16;border-color:#16a34a;color:#4ade80;}
.q-dot.err{background:#1c0f0f;border-color:#dc2626;color:#f87171;}
.side-stats{display:flex;justify-content:space-between;padding-top:14px;margin-top:14px;border-top:1px solid #1e3a5f;font-size:13px;}

.results-hero{background:linear-gradient(160deg,#0f172a,#0d1b3e 60%,#0a0f1a);border-bottom:1px solid #1e3a5f;padding:60px 32px 48px;text-align:center;position:relative;overflow:hidden;}
.results-orb{position:absolute;top:50%;left:50%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(29,78,216,.13) 0%,transparent 68%);transform:translate(-50%,-50%);pointer-events:none;}
.results-emoji{font-size:64px;margin-bottom:14px;display:block;animation:scaleIn .5s .1s ease both;}
.results-title{font-size:32px;font-weight:900;color:#fff;margin-bottom:6px;animation:fadeUp .5s .2s ease both;}
.results-score{font-size:80px;font-weight:900;line-height:1;margin:12px 0;animation:countUp .6s .3s ease both;}
.results-sub{font-size:15px;color:#94a3b8;animation:fadeUp .5s .4s ease both;}
.results-cta{display:flex;gap:12px;justify-content:center;margin-top:32px;flex-wrap:wrap;animation:fadeUp .5s .5s ease both;}
.results-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:40px 0 64px;align-items:start;}
@media(max-width:720px){.results-grid{grid-template-columns:1fr;}}

.cat-res-row{margin-bottom:14px;}
.cat-res-top{display:flex;justify-content:space-between;margin-bottom:6px;align-items:center;}
.cat-res-bar{height:6px;background:#0a0f1a;border-radius:6px;overflow:hidden;}
.cat-res-fill{height:100%;border-radius:6px;animation:barFill 1s ease both;animation-delay:var(--d,0s);}
.wrong-item{background:#1c0f0f;border:1px solid rgba(220,38,38,.15);border-radius:12px;padding:14px;margin-bottom:10px;transition:border-color .15s;}
.wrong-item:hover{border-color:rgba(220,38,38,.35);}
.wrong-q{font-size:12px;color:#fca5a5;line-height:1.55;margin-bottom:7px;}
.wrong-yours{font-size:12px;color:#f87171;margin-bottom:3px;}
.wrong-ok{font-size:12px;color:#86efac;}

.footer{border-top:1px solid #1e3a5f;background:#0f172a;padding:28px 32px;text-align:center;}
.footer p{font-size:12px;color:#475569;}

@media(max-width:640px){
  .navbar{padding:0 16px;}
  .hero{padding:56px 20px 48px;}
  .hero-icon-inner{width:64px;height:64px;font-size:32px;}
  .stats-grid{grid-template-columns:repeat(2,1fr);}
  .container{padding:0 16px;}
  .quiz-body{padding:20px 16px;}
  .q-card{padding:20px;}
  .quiz-topbar{padding:12px 16px;}
  .results-hero{padding:44px 20px 36px;}
  .results-score{font-size:60px;}
  .footer{padding:20px 16px;}
}

/* ── DOC VIEWER ── */
.docviewer-overlay{position:fixed;inset:0;z-index:500;background:rgba(5,10,20,0.92);backdrop-filter:blur(8px);display:flex;flex-direction:column;animation:fadeIn .25s ease;}
.docviewer-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:#0f172a;border-bottom:1px solid #1e3a5f;flex-shrink:0;}
.docviewer-title{font-size:14px;font-weight:700;color:#fff;}
.docviewer-meta{font-size:12px;color:#64748b;margin-top:2px;}
.docviewer-close{background:transparent;border:1px solid #1e3a5f;color:#94a3b8;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:13px;transition:all .15s;}
.docviewer-close:hover{border-color:#ef4444;color:#ef4444;}
.docviewer-iframe{flex:1;border:none;background:#fff;}
.docviewer-fallback{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:40px;}
.docviewer-fallback p{color:#94a3b8;font-size:14px;text-align:center;}

/* ── TEMARIO SCREEN ── */
.temario-header{background:linear-gradient(160deg,#0f172a,#0d1b3e);border-bottom:1px solid #1e3a5f;padding:48px 32px 36px;}
.temario-title{font-size:clamp(24px,4vw,40px);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:8px;animation:fadeUp .5s ease both;}
.temario-sub{font-size:14px;color:#94a3b8;animation:fadeUp .5s .1s ease both;}
.temario-filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;animation:fadeUp .5s .2s ease both;}
.temario-body{max-width:900px;margin:0 auto;padding:32px 32px 64px;}
.cat-section{margin-bottom:40px;}
.cat-section-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid;}
.cat-section-icon{font-size:22px;}
.cat-section-name{font-size:18px;font-weight:800;color:#fff;}
.cat-section-count{font-size:12px;color:#64748b;background:#0a0f1a;border:1px solid #1e3a5f;border-radius:10px;padding:3px 10px;margin-left:auto;}

.q-item{background:#0f172a;border:1px solid #1e3a5f;border-radius:14px;margin-bottom:10px;overflow:hidden;transition:border-color .2s;}
.q-item:hover{border-color:#1e4a7a;}
.q-item-header{display:flex;align-items:flex-start;gap:14px;padding:16px 20px;cursor:pointer;user-select:none;}
.q-item-num{min-width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;margin-top:1px;}
.q-item-text{font-size:14px;color:#cbd5e1;line-height:1.6;flex:1;white-space:pre-line;}
.q-item-chevron{color:#475569;font-size:14px;flex-shrink:0;margin-top:3px;transition:transform .2s;}
.q-item.open .q-item-chevron{transform:rotate(180deg);}
.q-item-body{padding:0 20px 18px 62px;animation:fadeUp .2s ease both;}
.q-answers{display:flex;flex-direction:column;gap:7px;margin-bottom:14px;}
.q-ans{display:flex;align-items:flex-start;gap:10px;padding:9px 13px;border-radius:10px;font-size:13px;}
.q-ans.correct{background:#052e16;border:1px solid #16a34a;color:#86efac;}
.q-ans.wrong{background:#111827;border:1px solid #1e3a5f;color:#64748b;}
.q-ans-letter{min-width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.q-explanation{background:#0a0f1a;border:1px solid #1e3a5f;border-radius:10px;padding:12px 14px;}
.q-explanation p{font-size:12px;color:#94a3b8;line-height:1.6;}
.q-explanation span{color:#3b82f6;font-weight:600;}

@media(max-width:640px){.temario-body{padding:20px 16px 48px;}.temario-header{padding:36px 16px 28px;}}
`;

export default function VuelaRPAS() {
  const [screen,     setScreen]     = useState("home");
  const [mode,       setMode]       = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [current,    setCurrent]    = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [answered,   setAnswered]   = useState(false);
  const [results,    setResults]    = useState([]);
  const [filterCat,  setFilterCat]  = useState("Todas");
  const [showExp,    setShowExp]    = useState(false);
  const [statsVis,   setStatsVis]   = useState(false);
  const [studyResults, setStudyResults] = useState([]); // track study mode answers
  // doc viewer
  const [docViewer,  setDocViewer]  = useState(null); // { url, title, desc }
  // temario
  const [temarioCat, setTemarioCat] = useState("Todas");
  const [openQ,      setOpenQ]      = useState(null);

  const statsRef = useRef(null);
  const fadeIn   = useFadeIn(current);

  useEffect(() => {
    const id = "vuela-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS; document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const startExam = useCallback(() => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, EXAM_SIZE));
    setCurrent(0); setSelected(null); setAnswered(false); setResults([]);
    setMode("exam"); setScreen("quiz"); window.scrollTo(0, 0);
  }, []);

  const startStudy = useCallback((cat) => {
    const pool = cat === "Todas" ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.category === cat);
    setQuestions(shuffle(pool));
    setCurrent(0); setSelected(null); setAnswered(false); setShowExp(false); setStudyResults([]);
    setMode("study"); setScreen("quiz"); window.scrollTo(0, 0);
  }, []);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    if (mode === "exam") setResults(r => [...r, { q: questions[current], selected: idx, correct: idx === questions[current].correct }]);
    if (mode === "study") setStudyResults(r => [...r, { index: current, correct: idx === questions[current].correct }]);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setScreen(mode === "exam" ? "results" : "home"); return; }
    setCurrent(c => c + 1); setSelected(null); setAnswered(false); setShowExp(false);
    window.scrollTo(0, 0);
  };

  const score  = results.filter(r => r.correct).length;
  const pct    = Math.round((score / EXAM_SIZE) * 100);
  const passed = pct >= PASS_SCORE;
  const q      = questions[current];

  /* ── Navbar ── */
  const Navbar = ({ extraNav }) => (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setScreen("home")}>
        <div className="nav-icon"><svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="10" ry="6" fill="white" opacity="0.95"/><rect x="27" y="28" width="10" height="8" rx="2" fill="white" opacity="0.9"/><line x1="32" y1="28" x2="16" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="28" x2="48" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="36" x2="16" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="36" x2="48" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round"/><ellipse cx="16" cy="18" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="48" cy="18" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="16" cy="46" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="48" cy="46" rx="6" ry="4" fill="white" opacity="0.8"/><circle cx="32" cy="32" r="3" fill="#93c5fd"/></svg></div>
        <span className="nav-title">Vuela</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {extraNav}
        
      </div>
    </nav>
  );

  /* ── Doc Viewer Overlay ── */
  const DocViewer = () => {
    if (!docViewer) return null;
    return (
      <div className="docviewer-overlay">
        <div className="docviewer-bar">
          <div>
            <div className="docviewer-title">{docViewer.icon} {docViewer.title}</div>
            <div className="docviewer-meta">{docViewer.desc}</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href={docViewer.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", padding: "7px 14px", border: "1px solid #1e3a5f", borderRadius: 8 }}>
              ↗ Abrir en nueva pestaña
            </a>
            <button className="docviewer-close" onClick={() => setDocViewer(null)}>✕ Cerrar</button>
          </div>
        </div>
        <iframe
          className="docviewer-iframe"
          src={docViewer.url.endsWith(".pdf")
            ? `https://docs.google.com/viewer?url=${encodeURIComponent(docViewer.url)}&embedded=true`
            : docViewer.url}
          title={docViewer.title}
          onError={() => {}}
        />
      </div>
    );
  };

  /* ═══════════ HOME ═══════════ */
  if (screen === "home") return (
    <div style={{ minHeight: "100vh" }}>
      <DocViewer />
      <Navbar extraNav={
        <button onClick={() => setScreen("temario")} style={{ fontSize: 13, color: "#94a3b8", background: "transparent", border: "1px solid #1e3a5f", borderRadius: 8, padding: "6px 14px", cursor: "pointer", transition: "all .15s" }}
          onMouseOver={e => { e.target.style.borderColor="#3b82f6"; e.target.style.color="#3b82f6"; }}
          onMouseOut={e => { e.target.style.borderColor="#1e3a5f"; e.target.style.color="#94a3b8"; }}>
          📋 Temario
        </button>
      } />

      <section className="hero">
        <div className="hero-orb" /><div className="hero-orb2" />
        <div className="hero-icon-wrap"><div className="hero-icon-inner"><svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="10" ry="6" fill="white" opacity="0.95"/><rect x="27" y="28" width="10" height="8" rx="2" fill="white" opacity="0.9"/><line x1="32" y1="28" x2="16" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/><line x1="32" y1="28" x2="48" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/><line x1="32" y1="36" x2="16" y2="44" stroke="white" strokeWidth="3.5" strokeLinecap="round"/><line x1="32" y1="36" x2="48" y2="44" stroke="white" strokeWidth="3.5" strokeLinecap="round"/><ellipse cx="16" cy="18" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="48" cy="18" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="16" cy="46" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="48" cy="46" rx="6" ry="4" fill="white" opacity="0.8"/><circle cx="32" cy="32" r="3" fill="#93c5fd"/></svg></div></div>
        <h1 className="hero-title">Vuela</h1>
        <p className="hero-sub">
          Simulador para la obtención de tu credencial de operador RPAS.
          Practica las {ALL_QUESTIONS.length} preguntas con explicaciones detalladas.
        </p>

        <div className="hero-cta">
          <button className="btn-primary" onClick={startExam}>✈️  Iniciar Examen</button>
          <button className="btn-outline" onClick={() => startStudy("Todas")}>📚  Modo Estudio</button>
          <button className="btn-outline" onClick={() => setScreen("temario")}>📋  Ver Temario</button>
        </div>
      </section>



      <div className="container">
        <div className="main-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div className="card" style={{ animation: "fadeUp .6s .1s ease both" }}>
              <div className="card-header">
                <span className="card-header-icon">🎯</span>
                <div>
                  <div className="card-header-title">Elige cómo practicar</div>
                  <div className="card-header-sub">Examen simulado o estudio por categoría con explicaciones</div>
                </div>
              </div>
              <div className="card-body">
                <div className="mode-cards">
                  <button className="mode-card mode-card-exam" onClick={startExam}>
                    <span className="mode-emoji">🎯</span>
                    <div className="mode-title">Modo Examen</div>
                    <div className="mode-sub">{EXAM_SIZE} preguntas aleatorias. Necesitas {PASS_SCORE}% para aprobar. Sin explicaciones hasta el final.</div>
                  </button>
                  <button className="mode-card mode-card-study" onClick={() => startStudy(filterCat)}>
                    <span className="mode-emoji">📚</span>
                    <div className="mode-title">Modo Estudio</div>
                    <div className="mode-sub">Practica con explicaciones después de cada respuesta. Filtra por categoría para repasar temas específicos.</div>
                  </button>
                </div>
                <div style={{ borderTop: "1px solid #1e3a5f", paddingTop: 18 }}>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Estudiar por categoría</p>
                  <div className="cat-filters">
                    {CATEGORIES.map(cat => (
                      <button key={cat}
                        className={"cat-pill" + (filterCat === cat ? " active" : "")}
                        style={filterCat === cat ? { borderColor: CAT_COLOR[cat] || "#3b82f6", color: CAT_COLOR[cat] || "#3b82f6", background: (CAT_COLOR[cat] || "#3b82f6") + "18" } : {}}
                        onClick={() => setFilterCat(cat)}>{cat}</button>
                    ))}
                  </div>
                  <button className="btn-outline" style={{ width: "100%", marginTop: 4 }} onClick={() => startStudy(filterCat)}>
                    Estudiar {filterCat === "Todas" ? "todas las categorías" : filterCat} →
                  </button>
                </div>
              </div>
            </div>

            <div className="card" style={{ animation: "fadeUp .6s .2s ease both" }}>
              <div className="card-header">
                <span className="card-header-icon">📋</span>
                <div>
                  <div className="card-header-title">Temario del examen</div>
                  <div className="card-header-sub">Haz clic para ver todas las preguntas y respuestas</div>
                </div>
              </div>
              <div className="card-body">
                {CATEGORIES.filter(c => c !== "Todas").map(cat => (
                  <div key={cat} className="cat-row" onClick={() => { setTemarioCat(cat); setScreen("temario"); }}>
                    <div className="cat-row-left">
                      <div className="cat-dot" style={{ background: CAT_COLOR[cat] || "#3b82f6" }} />
                      <span style={{ fontSize: 19, marginRight: 6 }}>{CAT_ICON[cat]}</span>
                      <span className="cat-name">{cat}</span>
                    </div>
                    <span className="cat-count">{ALL_QUESTIONS.filter(q => q.category === cat).length} preguntas</span>
                  </div>
                ))}
                <button className="btn-outline" style={{ width: "100%", marginTop: 16 }} onClick={() => { setTemarioCat("Todas"); setScreen("temario"); }}>
                  Ver todas las preguntas →
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ animation: "fadeUp .6s .3s ease both" }}>
              <div className="card-header">
                <span className="card-header-icon"><svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="10" ry="6" fill="white" opacity="0.95"/><rect x="27" y="28" width="10" height="8" rx="2" fill="white" opacity="0.9"/><line x1="32" y1="28" x2="16" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="28" x2="48" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="36" x2="16" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round"/><line x1="32" y1="36" x2="48" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round"/><ellipse cx="16" cy="18" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="48" cy="18" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="16" cy="46" rx="6" ry="4" fill="white" opacity="0.8"/><ellipse cx="48" cy="46" rx="6" ry="4" fill="white" opacity="0.8"/><circle cx="32" cy="32" r="3" fill="#93c5fd"/></svg></span>
                <div><div className="card-header-title">Credencial RPAS</div></div>
              </div>
              <div className="card-body">
                {[
                  ["📄", "Normativa",   "Regulada por la DAN 151 y DAN 91"],
                  ["⏱",  "Vigencia",    "La credencial tiene duración de 24 meses"],
                  ["✅", "Aprobación",  "Mínimo 70% en el examen escrito oficial"],
                  ["🎓", "Temario",     "DAN 151, DAN 91, meteorología, aerodinámica y operaciones"],
                  ["🔞", "Requisito",   "Mayor de 18 años con instrucción teórica y práctica certificada"],
                ].map(([icon, ttl, desc]) => (
                  <div key={ttl} className="info-row">
                    <span className="info-icon">{icon}</span>
                    <div><div className="info-ttl">{ttl}</div><div className="info-desc">{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ animation: "fadeUp .6s .4s ease both" }}>
              <div className="card-header">
                <span className="card-header-icon">📚</span>
                <div>
                  <div className="card-header-title">Bibliografía oficial</div>
                  <div className="card-header-sub">Clic para abrir el documento aquí mismo</div>
                </div>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {BIBLIO.map(b => (
                  <div key={b.title} className="biblio-item" onClick={() => setDocViewer(b)} style={{ cursor: "pointer" }}>
                    <span className="biblio-icon">{b.icon}</span>
                    <div>
                      <div className="biblio-title">{b.title}</div>
                      <div className="biblio-desc">{b.desc}</div>
                    </div>
                    <span className="biblio-arrow">⤢</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Vuela — Simulador de práctica RPAS · Sin registro requerido</p>
      </footer>
    </div>
  );

  /* ═══════════ TEMARIO ═══════════ */
  if (screen === "temario") {
    const filteredCats = temarioCat === "Todas"
      ? CATEGORIES.filter(c => c !== "Todas")
      : [temarioCat];

    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1a" }}>
        <DocViewer />
        <Navbar />

        <div className="temario-header">
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
              ← Volver al inicio
            </button>
            <h1 className="temario-title">📋 Temario del Examen</h1>
            <p className="temario-sub">
              {ALL_QUESTIONS.length} preguntas oficiales · Banco DGAC Chile Marzo 2026 · Haz clic en cada pregunta para ver la respuesta
            </p>
            <div className="temario-filters">
              {CATEGORIES.map(cat => (
                <button key={cat}
                  className={"cat-pill" + (temarioCat === cat ? " active" : "")}
                  style={temarioCat === cat ? { borderColor: CAT_COLOR[cat] || "#3b82f6", color: CAT_COLOR[cat] || "#3b82f6", background: (CAT_COLOR[cat] || "#3b82f6") + "18" } : {}}
                  onClick={() => { setTemarioCat(cat); setOpenQ(null); }}>
                  {cat === "Todas" ? "Todas" : `${CAT_ICON[cat]} ${cat}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="temario-body">
          {filteredCats.map(cat => {
            const qs = ALL_QUESTIONS.filter(q => q.category === cat);
            const color = CAT_COLOR[cat] || "#3b82f6";
            return (
              <div key={cat} className="cat-section">
                <div className="cat-section-header" style={{ borderColor: color + "44" }}>
                  <span className="cat-section-icon">{CAT_ICON[cat]}</span>
                  <span className="cat-section-name" style={{ color }}>{cat}</span>
                  <span className="cat-section-count">{qs.length} preguntas</span>
                </div>

                {qs.map((q, qi) => {
                  const key = `${cat}-${qi}`;
                  const isOpen = openQ === key;
                  return (
                    <div key={key} className={"q-item" + (isOpen ? " open" : "")} style={isOpen ? { borderColor: color + "55" } : {}}>
                      <div className="q-item-header" onClick={() => setOpenQ(isOpen ? null : key)}>
                        <span className="q-item-num" style={{ background: color + "22", color }}>
                          {qi + 1}
                        </span>
                        <span className="q-item-text">{q.question}</span>
                        <span className="q-item-chevron">▼</span>
                      </div>

                      {isOpen && (
                        <div className="q-item-body">
                          <div className="q-answers">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className={"q-ans " + (oi === q.correct ? "correct" : "wrong")}>
                                <span className="q-ans-letter" style={oi === q.correct
                                  ? { background: "#16a34a", color: "#fff" }
                                  : { background: "#1e3a5f", color: "#64748b" }}>
                                  {oi === q.correct ? "✓" : String.fromCharCode(65 + oi)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                          <div className="q-explanation">
                            <p><span>💡 Explicación: </span>{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <footer className="footer">
          <p>Vuela — Simulador de práctica RPAS</p>
        </footer>
      </div>
    );
  }

  /* ═══════════ QUIZ ═══════════ */
  if (screen === "quiz" && q) {
    const cc = CAT_COLOR[q.category] || "#3b82f6";
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div className="quiz-topbar">
          <div className="quiz-topbar-inner">
            <div className="quiz-meta">
              <button className="quiz-back" onClick={() => setScreen("home")}>← Salir</button>
              <span className="quiz-cat-badge" style={{ background: cc + "22", color: cc, border: `1px solid ${cc}44` }}>
                {CAT_ICON[q.category]} {q.category}
              </span>
              <span className="quiz-counter">{current + 1} / {questions.length}</span>
            </div>
            <div className="quiz-prog-track">
              <div className="quiz-prog-fill" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: mode === "exam" ? "#3b82f6" : "#10b981" }} />
            </div>
          </div>
        </div>

        <div className="quiz-body">
          <div className="quiz-inner">
            <div>
              <div className={"q-card" + (fadeIn ? " anim" : "")}>
                <div className="q-num">Pregunta {current + 1} de {questions.length} · {q.category}</div>
                <p className="q-text">{q.question}</p>
                <div className="options">
                  {q.options.map((opt, i) => {
                    let cls = "opt";
                    let lBg = "#1e3a5f", lCol = "#64748b";
                    const userCorrect = selected === q.correct;
                    if (answered) {
                      if (i === selected && userCorrect)  { cls += " correct"; lBg = "#16a34a"; lCol = "#fff"; }          // elegiste bien → verde relleno
                      else if (i === selected && !userCorrect) { cls += " wrong"; lBg = "#dc2626"; lCol = "#fff"; }       // elegiste mal → rojo relleno
                      else if (i === q.correct && !userCorrect) { cls += " correct"; lBg = "#16a34a"; lCol = "#fff"; }   // respuesta correcta → verde relleno (referencia)
                      else                                { cls += " muted answered"; }
                    } else if (selected === i){ lBg = "#3b82f6"; lCol = "#fff"; }
                    return (
                      <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                        <span className="opt-letter" style={{ background: lBg, color: lCol }}>
                          {answered && i === q.correct ? "✓" : answered && i === selected ? "✗" : String.fromCharCode(65 + i)}
                        </span>
                        <span className="opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <>
                    {mode === "study" && !showExp && (
                      <button className="show-expl-btn" onClick={() => setShowExp(true)}>💡 Ver explicación</button>
                    )}
                    {(mode === "exam" || showExp) && (
                      <div className={"expl " + (selected === q.correct ? "ok" : "err")}>
                        <p>{selected === q.correct
                          ? `✓ ¡Correcto!${mode === "study" ? " — " + q.explanation : ""}`
                          : mode === "exam"
                            ? `✗ La respuesta correcta es: ${q.options[q.correct]}`
                            : `✗ ${q.explanation}`}</p>
                      </div>
                    )}
                    <button className="quiz-next" onClick={next}>
                      {current + 1 >= questions.length
                        ? (mode === "exam" ? "Ver resultados 🏁" : "Finalizar 🏁")
                        : "Siguiente pregunta →"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="quiz-side">
                <div className="side-label">{mode === "exam" ? "Progreso del examen" : "Preguntas"}</div>
                <div className="q-dots">
                  {questions.map((_, i) => {
                    let cls = "q-dot";
                    if (i === current) cls += " cur";
                    else if (mode === "exam" && results[i]) cls += results[i].correct ? " ok" : " err";
                    else if (mode === "study") {
                      const sr = studyResults.find(r => r.index === i);
                      if (sr) cls += sr.correct ? " ok" : " err";
                    }
                    return <div key={i} className={cls}>{i + 1}</div>;
                  })}
                </div>
                {mode === "exam" && (
                  <div className="side-stats">
                    <span style={{ color: "#4ade80", fontWeight: 700 }}>✓ {results.filter(r => r.correct).length}</span>
                    <span style={{ color: "#64748b", fontSize: 12 }}>correctas</span>
                    <span style={{ color: "#f87171", fontWeight: 700 }}>✗ {results.filter(r => !r.correct).length}</span>
                    <span style={{ color: "#64748b", fontSize: 12 }}>incorrectas</span>
                  </div>
                )}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e3a5f" }}>
                  <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Categoría actual</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cc }} />
                    <span style={{ fontSize: 13, color: "#cbd5e1" }}>{q.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════ RESULTS ═══════════ */
  if (screen === "results") return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a" }}>
      <Navbar />
      <div className="results-hero">
        <div className="results-orb" />
        <span className="results-emoji">{passed ? "🎉" : "📚"}</span>
        <h2 className="results-title">{passed ? "¡Examen aprobado!" : "No aprobado — ¡Sigue practicando!"}</h2>
        <div className="results-score" style={{ color: passed ? "#4ade80" : "#f87171" }}>{pct}%</div>
        <p className="results-sub">{score} de {EXAM_SIZE} respuestas correctas · Mínimo requerido: {PASS_SCORE}%</p>
        <div className="results-cta">
          <button className="btn-primary" onClick={startExam}>🔁  Nuevo examen</button>
          <button className="btn-outline" onClick={() => setScreen("home")}>🏠  Inicio</button>
          <button className="btn-outline" onClick={() => { setTemarioCat("Todas"); setScreen("temario"); }}>📋  Ver temario</button>
        </div>
      </div>

      <div className="container">
        <div className="results-grid">
          <div className="card" style={{ animation: "fadeUp .5s .1s ease both" }}>
            <div className="card-header">
              <span className="card-header-icon">📊</span>
              <div>
                <div className="card-header-title">Resultados por categoría</div>
                <div className="card-header-sub">{passed ? "Buen resultado — sigue así" : "Identifica los temas a reforzar"}</div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>
                  <span>Puntuación total</span>
                  <span style={{ color: passed ? "#4ade80" : "#f87171", fontWeight: 700 }}>{pct}% / {PASS_SCORE}% mín.</span>
                </div>
                <div style={{ height: 10, background: "#0a0f1a", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 6, background: passed ? "#16a34a" : "#dc2626", width: `${pct}%`, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
                </div>
              </div>
              {CATEGORIES.filter(c => c !== "Todas").map((cat, ci) => {
                const cqs = results.filter(r => r.q.category === cat);
                if (!cqs.length) return null;
                const ok = cqs.filter(r => r.correct).length;
                const cp = Math.round((ok / cqs.length) * 100);
                return (
                  <div key={cat} className="cat-res-row">
                    <div className="cat-res-top">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CAT_COLOR[cat] || "#3b82f6" }} />
                        <span style={{ fontSize: 13, color: "#cbd5e1" }}>{cat}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: ok === cqs.length ? "#4ade80" : ok === 0 ? "#f87171" : "#fbbf24" }}>{ok}/{cqs.length}</span>
                        <button onClick={() => { setTemarioCat(cat); setScreen("temario"); }}
                          style={{ fontSize: 11, color: "#3b82f6", background: "transparent", border: "1px solid #1e3a5f", borderRadius: 6, padding: "2px 8px", cursor: "pointer" }}>
                          Repasar
                        </button>
                      </div>
                    </div>
                    <div className="cat-res-bar">
                      <div className="cat-res-fill" style={{ width: `${cp}%`, "--w": `${cp}%`, "--d": `${ci * 0.08}s`, background: CAT_COLOR[cat] || "#3b82f6", opacity: .85 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ animation: "fadeUp .5s .2s ease both" }}>
            <div className="card-header">
              <span className="card-header-icon">❌</span>
              <div>
                <div className="card-header-title">Respuestas incorrectas</div>
                <div className="card-header-sub">{results.filter(r => !r.correct).length} de {EXAM_SIZE} preguntas</div>
              </div>
            </div>
            <div className="card-body" style={{ maxHeight: 520, overflowY: "auto" }}>
              {results.filter(r => !r.correct).length === 0
                ? <p style={{ fontSize: 14, color: "#4ade80", textAlign: "center", padding: "24px 0" }}>🎉 ¡Sin ningún error!</p>
                : results.filter(r => !r.correct).map((r, i) => (
                  <div key={i} className="wrong-item">
                    <p className="wrong-q">{r.q.question.split("\n")[0].slice(0, 90)}{r.q.question.length > 90 ? "…" : ""}</p>
                    <p className="wrong-yours">Tu respuesta: {r.q.options[r.selected]}</p>
                    <p className="wrong-ok">✓ Correcta: {r.q.options[r.q.correct]}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Vuela — Simulador de práctica RPAS</p>
      </footer>
    </div>
  );

  return null;
}