<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import ScrollToTopButton from "./faq-section/ScrollToTopButton.vue";

import diagramSvgUrl from "@/assets/diagram.svg";

const el = ref<HTMLDivElement | null>(null);
const showScrollToTopButton = ref(false);

onMounted(() => {
  window.addEventListener("scroll", onWindowScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onWindowScroll);
});

function onWindowScroll() {
  const position = el.value?.getBoundingClientRect();
  const top = position?.top ?? 0;

  showScrollToTopButton.value = top < window.innerHeight / 2;
}
</script>

<template>
  <div id="faq" ref="el">
    <h1>FAQ</h1>
    <div>
      <h2>"Can you explain how this works to me simply?"</h2>
      <p>
        I use
        <a
          href="https://en.wikipedia.org/wiki/Elliptic-curve_cryptography"
          target="_blank"
          rel="noopener noreferrer"
          >Elliptic-curve cryptography</a
        >
        to exchange keys and
        <a
          href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
          target="_blank"
          rel="noopener noreferrer"
          >Advanced Encryption Standard (AES)</a
        >
        to encrypt the files and messages. The encryption link contains the
        public key. The decryption link contains the private key.
      </p>

      <p>
        You might find these YouTube videos helpful: <br /><a
          href="https://www.youtube.com/watch?v=NF1pwjL9-DE"
          target="_blank"
          rel="noopener noreferrer"
          >Elliptic Curves - Computerphile</a
        >
        <br /><a
          href="https://www.youtube.com/watch?v=NmM9HA2MQGI"
          target="_blank"
          rel="noopener noreferrer"
          >Secret Key Exchange (Diffie-Hellman) - Computerphile</a
        >
        <br /><a
          href="https://www.youtube.com/watch?v=O4xNJsjtN6E"
          target="_blank"
          rel="noopener noreferrer"
          >AES Explained (Advanced Encryption Standard) - Computerphile</a
        >
      </p>

      <p>
        Wikipedia: <br /><a
          href="https://en.wikipedia.org/wiki/Elliptic-curve_cryptography"
          target="_blank"
          rel="noopener noreferrer"
          >Elliptic-curve cryptography</a
        >
        <br /><a
          href="https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman"
          target="_blank"
          rel="noopener noreferrer"
          >Elliptic-curve Diffie–Hellman</a
        >
        <br /><a
          href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
          target="_blank"
          rel="noopener noreferrer"
          >Advanced Encryption Standard (AES)</a
        >
      </p>
    </div>

    <div>
      <h2>"How secure is this?"</h2>
      <p>
        I use
        <a
          href="https://en.wikipedia.org/wiki/Elliptic-curve_cryptography"
          target="_blank"
          rel="noopener noreferrer"
          >Elliptic-curve cryptography</a
        >
        to exchange keys,
        <a
          href="https://en.wikipedia.org/wiki/Elliptic-curve_cryptography"
          target="_blank"
          rel="noopener noreferrer"
          >Elliptic-curve cryptography</a
        >
        is also used in bitcoin to authenticate billion of dollars of
        transactions every day.
      </p>

      <figure>
        <blockquote
          cite="https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/"
        >
          <p>
            "the U.S. government uses it to protect internal communications, the
            Tor project uses it to help assure anonymity, it is the mechanism
            used to prove ownership of bitcoins, it provides signatures in
            Apple's iMessage service, it is used to encrypt DNS information with
            DNSCurve, and it is the preferred method for authentication for
            secure web browsing over SSL/TLS."
          </p>
        </blockquote>
        <figcaption>
          -<a
            href="https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <cite
              >A (Relatively Easy To Understand) Primer on Elliptic Curve
              Cryptography</cite
            > </a
          >, CloudFlare
        </figcaption>
      </figure>

      <p>
        <a
          href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
          target="_blank"
          rel="noopener noreferrer"
          >Advanced Encryption Standard (AES)</a
        >
        is then uses to encrypt the files and messages. According to Wikipedia:
      </p>

      <figure>
        <blockquote
          cite="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
        >
          <p>
            "Fifty supercomputers that could check a billion billion
            (10<sup>18</sup>) AES keys per second (if such a device could ever
            be made) would, in theory, require about 3×10<sup>51</sup> years to
            exhaust the 256-bit key space." (3×10<sup>51</sup> years is 3
            sexdecillion years)
          </p>
        </blockquote>
      </figure>

      <p>
        In addition everything is done in the browser. Nothing leaves your
        device and I do not collect any of your information. I don't even have a
        server that can process users information (can't afford one). Try
        disconnecting your device from the internet, this site would still work!
      </p>

      <p>
        The source code for this website is publicly available on
        <a
          href="https://github.com/Calvin-LL/secretdrop.io"
          target="_blank"
          rel="noopener noreferrer"
          >Github</a
        >
        anyone can read it since I have nothing to hide.
      </p>
    </div>

    <div>
      <h2>"Can you explain how this works to me in more detail?"</h2>
      <figure>
        <a :href="diagramSvgUrl" target="_blank" rel="noopener noreferrer">
          <img
            src="@/assets/diagram.svg"
            alt="Diagram of how SecretDrop.io works"
          />
        </a>
        <figcaption>Here is a diagram</figcaption>
      </figure>
      <p>
        Elliptic-curve Diffie–Hellman (ECDH) is used for both sides to establish
        a shared secret. I chose Curve25519 because it is considered the most
        secured curve. The shared secret is then pass through PBKDF2 with
        3000000 iterations (3000000 iterations takes around 1 second on my phone
        and laptop) and 16 bits of random data as salt to derive a 256 bit AES
        key. The message or file is then encrypted with AES-GCM. Other than the
        PBKDF2 key derivation operation, all other delays are artificially
        added. EC and RSA are actually really fast. Besides PBKDF2, all other
        operations are done in less than a second (other than large files for
        RSA). When multiple files are encrypted, each file will have its own EC
        key pair.
      </p>
      <p>
        Encryption links are of the form:<br />
        https://SecretDrop.io/encrypt/#key=[public key]
      </p>
      <p>
        Decryption links are of the form:<br />
        https://SecretDrop.io/decrypt/#key=[private key]
      </p>
      <p>Encrypted messages are of the form:</p>
      <div style="overflow-x: scroll">
        <pre>
          <code>
+-------------+---------------+------------------------------------------------------------------+
| size (byte) |      type     |                            description                           |
+-------------+---------------+------------------------------------------------------------------+
| variable    | base64 string | encryption side public key                                       |
+-------------+---------------+------------------------------------------------------------------+
| 1           | string        | ","                                                              |
+-------------+---------------+--------------------+---------------------+-----------------------+
| variable    | base64 string |     size (byte)    |         type        |      description      |
|             |               +--------------------+---------------------+-----------------------+
|             |               | 4                  | uint32 (big endian) | PBKDF2 salt length    |
|             |               +--------------------+---------------------+-----------------------+
|             |               | PBKDF2 salt length | random bytes        | PBKDF2 salt           |
|             |               +--------------------+---------------------+-----------------------+
|             |               | 12                 | random bytes        | initialization vector |
|             |               +--------------------+---------------------+-----------------------+
|             |               | variable           |                     | encrypted binary      |
|             |               +--------------------+---------------------+-----------------------+
|             |               | 16                 |                     | authentication tag    |
+-------------+---------------+--------------------+---------------------+-----------------------+
          </code>
        </pre>
      </div>
      <p>
        [encryption side public key string],[{[PBKDF2 salt length (4
        bytes)][PBKDF2 salt][iv (12 bytes)][encrypted binary of lz-utf8
        string][authentication tag (16 bytes)]} in base64]"
      </p>
      <p>Encrypted files are of the form:</p>
      <div style="overflow-x: scroll">
        <pre>
          <code>
+-----------------------------------+---------------------+-----------------------------------+
|            size (byte)            |         type        |            description            |
+-----------------------------------+---------------------+-----------------------------------+
| 4                                 | uint32 (big endian) | encryption side public key length |
+-----------------------------------+---------------------+-----------------------------------+
| encryption side public key length | utf8 array          | encryption side public key        |
+-----------------------------------+---------------------+-----------------------------------+
| 4                                 | uint32 (big endian) | PBKDF2 salt length                |
+-----------------------------------+---------------------+-----------------------------------+
| PBKDF2 salt length                | random bytes        | PBKDF2 salt                       |
+-----------------------------------+---------------------+-----------------------------------+
| 12                                | random bytes        | initialization vector             |
+-----------------------------------+---------------------+-----------------------------------+
| variable                          |                     | encrypted binary                  |
+-----------------------------------+---------------------+-----------------------------------+
| 16                                |                     | authentication tag                |
+-----------------------------------+---------------------+-----------------------------------+
          </code>
        </pre>
      </div>
      <p>
        {[encryption side public key length (4 bytes)][encryption side public
        key][PBKDF2 salt length (4 bytes)][PBKDF2 salt][iv (12 bytes)][encrypted
        binary][authentication tag (16 bytes)]}
      </p>
    </div>

    <div>
      <h2>"Can I have some icons plz?"</h2>
      <p>Right click to save these svg icons</p>
      <p>
        <img
          class="icons"
          src="@/assets/icon-for-download/logo-tilted-icon-black.svg"
        />
        <img
          class="icons"
          src="@/assets/icon-for-download/logo-tilted-icon-black-fill.svg"
        />
        <img
          class="icons"
          src="@/assets/icon-for-download/logo-tilted-icon-white.svg"
        />
        <img
          class="icons"
          src="@/assets/icon-for-download/logo-tilted-icon-white-fill.svg"
        />
      </p>
    </div>

    <div>
      <h2>"Who made this?"</h2>
      <p>
        I did. Check out
        <a href="https://calvin.sh" target="_blank" rel="noopener noreferrer"
          >my website</a
        >.
      </p>
    </div>

    <ScrollToTopButton v-show="showScrollToTopButton" />
  </div>
</template>

<style lang="scss">
@use "@/scss/global";

#faq {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  margin-top: 100px;
  margin-left: 16px;
  margin-right: 16px;

  figure {
    & > figcaption {
      text-align: center;
    }

    & > blockquote ~ figcaption {
      text-align: end;

      cite {
        font-style: normal;
      }
    }

    blockquote {
      margin-left: 0px;
      margin-right: 0px;

      p {
        border-radius: 8px;

        padding: 16px;

        background-color: rgba($color: #000, $alpha: 0.1);

        @media (prefers-color-scheme: dark) {
          background-color: rgba($color: #fff, $alpha: 0.1);
        }
      }
    }
  }

  & > h1 {
    font-weight: 500;
    width: 100%;
    max-width: 700px;
    contain: content;
  }

  & > div:not(.fab-container) {
    width: 100%;
    max-width: 700px;
    padding-left: 8px;
    padding-right: 8px;
    contain: content;

    & > h2 {
      font-weight: 500;
      margin-top: 48px;

      @media (max-width: 640px) {
        margin-top: 24px;
      }
    }

    a {
      overflow-wrap: break-word;
      word-break: break-all;
      color: #1976d2;

      &:visited {
        color: #512da8;
      }
    }

    .icons {
      margin: 2px;
      background-color: grey;
      max-width: 60px;
    }

    & > .diagram-container {
      @include global.flex-center;

      & > a {
        width: 100%;

        & > img {
          width: 100%;
          background-color: white;
        }
      }
    }
  }
}
</style>
