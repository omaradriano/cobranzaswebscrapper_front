import React from "react";
import styled from "styled-components";

const PrivacyPolicy: React.FC = () => {
  return (
    <PrivacyContainer>
      <h1>AVISO DE PRIVACIDAD</h1>
      <PrivacySection>
        <h3>Última actualización: 25 de Mayo de 2026.</h3>
        <p>
          En GoAgent (en adelante, "Nosotros" o "el Sitio"), accesible a través
          de la dirección web https://www.goagent.com.mx, nos tomamos muy en
          serio la seguridad y la privacidad de sus datos. Este Aviso de
          Privacidad describe cómo recolectamos, utilizamos, almacenamos y
          protegemos la información de los agentes de seguros y usuarios que
          utilizan nuestra plataforma web y nuestra extensión oficial de Google
          Chrome.
        </p>
      </PrivacySection>

      <PrivacySection>
        <h2>1. Responsable del Tratamiento de los Datos</h2>
        <p>
          El responsable de la recolección y tratamiento de sus datos personales
          es GoAgent, con domicilio de contacto en Chihuahua, Chihuahua, México
          y correo electrónico de soporte: oadriandev@gmail.com.
        </p>
      </PrivacySection>

      <PrivacySection>
        <h2>2. Datos Personales que Recolectamos</h2>
        <p>
          Para ofrecer las funciones de automatización y gestión de cobranza,
          GoAgent procesa los siguientes datos, divididos según su origen:
        </p>
        <ul>
          <li>
            Datos de Cuenta (Plataforma Web): Nombre completo del agente,
            dirección de correo electrónico, credenciales de acceso cifradas, y
            datos de facturación en caso de suscripciones de pago.
          </li>
          <li>
            Datos de Operación (Extensión de Chrome): Al ejecutar la
            sincronización mediante nuestra extensión de navegador, el software
            procesa información extraída de los portales de seguros del usuario,
            tales como: número de póliza, nombre del asegurado, vigencia de la
            póliza, montos de prima, estatus de pago (Activas, Anuladas, Por
            vencer) y fechas de corte.
          </li>
        </ul>
        <p>
          Declaración de Propósito Único (Chrome Web Store): La extensión de
          GoAgent lee la información de las pólizas únicamente bajo la acción
          explícita del usuario y con el único fin de centralizar la cobranza en
          su panel de control. No almacenamos ni guardamos las contraseñas de
          acceso a los portales de las aseguradoras.
        </p>
      </PrivacySection>

      <PrivacySection>
        <h2>3. Finalidad del Tratamiento de los Datos</h2>
        <p>
          Los datos recolectados se utilizan estrictamente para las siguientes
          finalidades necesarias para el servicio:
        </p>
        <ol>
          <li>
            Centralizar, organizar y mostrar el estatus de la cartera de pólizas
            en el Dashboard de GoAgent.
          </li>
          <li>
            Generar alertas automáticas de recordatorios de corte de pólizas y
            vencimientos de cobranza.
          </li>
          <li>
            Proporcionar soporte técnico y resolver incidencias del servicio.
          </li>
          <li>
            Mejorar las funciones de la plataforma mediante estadísticas de uso
            agregadas y anónimas.
          </li>
        </ol>
      </PrivacySection>

      <PrivacySection>
        <h2>4. Seguridad y Almacenamiento Tecnológico</h2>
        <p>
          Implementamos medidas de seguridad técnicas, administrativas y físicas
          para proteger su información contra accesos no autorizados, pérdidas o
          alteraciones:
        </p>
        <ul>
          <li>
            Encriptación en Tránsito: Toda la comunicación entre la extensión de
            Chrome, el frontend en React y nuestro servidor en la nube viaja de
            forma cifrada mediante protocolos HTTPS / SSL.
          </li>
          <li>
            Autenticación Segura: El acceso a la API está protegido mediante
            tokens de sesión firmados digitalmente (JWT - JSON Web Tokens).
          </li>
          <li>
            Infraestructura en la Nube: Los datos se almacenan en servidores y
            bases de datos relacionales con altos estándares de seguridad y
            cifrado de datos en reposo.
          </li>
        </ul>
      </PrivacySection>

      <PrivacySection>
        <h2>5. Transferencia de Datos</h2>
        <p>
          GoAgent no vende, no alquila, no comercializa ni transfiere sus datos
          personales ni la información de sus pólizas a terceros bajo ninguna
          circunstancia. La información solo es procesada internamente por las
          herramientas de infraestructura necesarias para mantener el servicio
          activo.
        </p>
      </PrivacySection>

      <PrivacySection>
        <h2>
          6. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
        </h2>
        <p>
          Como titular de sus datos, usted tiene derecho a conocer qué datos
          tenemos de usted, solicitar correcciones (Rectificación), pedir que
          los eliminemos por completo de nuestros servidores (Cancelación) u
          oponerse al uso de los mismos para fines específicos. Para ejercer
          cualquiera de estos derechos, o para solicitar la baja definitiva de
          su cuenta de GoAgent y el borrado de todo su histórico de pólizas,
          puede enviar una solicitud formal por correo electrónico a:
          oadriandev@gmail.com. Su solicitud será procesada en un plazo máximo
          de [ej: 5 días hábiles].
        </p>
      </PrivacySection>

      <PrivacySection>
        <h2>7. Cambios al Aviso de Privacidad</h2>
        <p>
          Nos reservamos el derecho de modificar este aviso en cualquier momento
          para adaptarlo a novedades legislativas o mejoras en nuestra
          extensión. Cualquier cambio será publicado en esta misma sección web
          con su respectiva fecha de actualización.
        </p>
      </PrivacySection>
    </PrivacyContainer>
  );
};

const PrivacyContainer = styled.div`
  padding: 10px 4vw;
`;

const PrivacySection = styled.div`
  & > p,
  & > ol,
  & > ul {
    margin-left: 25px;
  }
`;

export default PrivacyPolicy;
