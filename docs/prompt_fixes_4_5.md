Contexto del Proyecto:
Estoy trabajando en una aplicación de gestión de objetivos desarrollada con React. La app tiene una sección para crear y editar objetivos que actualmente presenta inconsistencias visuales y errores de lógica en la interfaz de usuario. Necesito unificar ambos formularios (Crear y Editar) y solucionar bugs específicos de interacción.

Problema a resolver:
El componente de gestión de objetivos necesita una limpieza profunda. Actualmente, la pantalla de "Crear" y la de "Editar" no son idénticas, el selector de colores ha perdido su diseño original y hay errores en el scroll de valores numéricos.

Tareas específicas a realizar:

- Unificación de Componentes: Refactoriza para que el formulario de "Crear" y el de "Editar" utilicen el mismo componente base, asegurando que visualmente sean indistinguibles. Manteniendo las diferencias con aquellos campos que no vayan en uno o en otro, pero de esa forma ambos funcionan de la misma manera frente al usuario

- Corrección de UI en Selectores:
    - Sustituir el elemento <select> estándar de colores por un selector visual personalizado (como el que tenía la app anteriormente). En el cual aparecia unicamente el circulo con el color a seleccionar, y al final del todo, un botón de "RGB" donde podias poner un color personalizado. Este al seleccionarlo debera abrir el mismo que se ve al colocar un color a una materia, que es muy practico para elegir un color a tu antojo

    - Ademas, quiero que en el selector de colores de el estado de animo se aplique también el color RGB, aunque esta bien que ahora mismo sean mucho menos colores

    - Eliminar el título que aparece en el icono seleccionado para limpiar la interfaz. y que solo salga el icono

- Selector de Días:

    - Centrar los días de la semana en su contenedor.

    - Asegurar que el diseño sea circular (formato "redondel").

    - Implementar una función de "Marcar/Desmarcar todos" los días de la semana. (Ya esta al crear, pero no al editar)

- Fix de Lógica y Visualización:

    - Bug de Scroll: Corregir el error que muestra números con decimales extraños al hacer scroll en los selectores numéricos (deben ser enteros limpios al scrollear, pero permitir numeros con coma si es escrito a mano).

    - Modo Oscuro/Claro: Ajustar los tokens de color para que los tonos sean legibles y armónicos en ambos temas. Que respeten el color seleccionado lo mas posible. Si selecciono "Indigo" el color debe ser exactamente Indigo, aunque puede variar un poco entre tonos para mejora visual, pero no exagerado. Y que el circulo se vea el color que va a salir en la interfaz, por ejemplo, para el tono claro, se usarian tonos mas "pastel" entonces en la seleccion deben verse con ese color pastel para el usuario, mientras que en tono oscuro seran mas saturados.

- Entregables:

    - Código refactorizado del componente de formulario (o los archivos .jsx / .tsx involucrados).

    - Estilos CSS/Tailwind necesarios para los cambios visuales (centrado, círculos y selector de color).

    - Lógica para el "toggle" de selección múltiple de días.

- Restricciones Técnicas:

    - Mantener la consistencia con el resto de la app (uso de SVGs y coherencia en grosores de línea/strokes).

    - Asegurar que el estado del formulario se limpie correctamente al cerrar o cancelar.

    - Que al cerrar la configuración de un modulo, si hay cambios pendientes, no cancele, sino que avise que hay cambios y pregunte si desea cancelar o guardar

    - Que al guardar una configuración de modulo salga un mensaje de "Cambios guardados"