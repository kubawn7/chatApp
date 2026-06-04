# 💬 Node.js Real-Time Chat App



Prosta i szybka aplikacja czatowa czasu rzeczywistego zbudowana w oparciu o środowisko Node.js, Express oraz bibliotekę Socket.io. Umożliwia komunikację tekstową, przesyłanie obrazów oraz informuje na bieżąco o aktywności innych użytkowników.



## ✨ Funkcjonalności



**Komunikacja w czasie rzeczywistym:** wysyłanie i odbieranie wiadomości tekstowych dzięki Socket.io.

**Przesyłanie obrazów:** Możliwość załączania plików graficznych (JPG, PNG, GIF). Zdjęcia są konwertowane na format Base64 po stronie klienta i renderowane bezpośrednio w oknie czatu.

**Wskaźnik pisania:** Kiedy jeden z użytkowników wprowadza tekst, pozostali widzą animowany wskaźnik (skaczące kropki) informujący o aktywności.

**system Anty-Spamowy:** Serwer śledzi częstotliwość zapytań (tekst i obrazy). Przekroczenie limitu (domyślnie **5 wiadomości w ciągu 5 sekund**) skutkuje zablokowaniem użytkownika (banned), zablokowaniem interfejsu klienta oraz zerwaniem połączenia WebSockets.

**Powiadomienia o połączeniu:** Alert informujący o dołączeniu nowego uczestnika do pokoju.

**Identyfikacja użytkowników:** Prosty system nadawania nicków przy wejściu. Własne wiadomości są oznaczane jako "Ja".



## 🛠️ Technologie



**Backend:**

* [Node.js](https://nodejs.org/)

* [Express.js](https://expressjs.com/) (serwowanie plików statycznych)

* [Socket.io](https://socket.io/) (komunikacja WebSockets)



**Frontend:**

* HTML5 / CSS3 (FontAwesome dla ikon)

* Vanilla JavaScript (obsługa DOM, FileReader API, klient Socket.io)



## 🚀 Instalacja i uruchomienie lokalne



1. **Sklonuj lub pobierz projekt** do lokalnego folderu.

2. **Zainstaluj zależności:**

 Upewnij się, że masz zainstalowanego Node.js. Następnie w terminalu, w głównym folderze projektu wpisz:

  ```bash
  npm install express socket.io
```

3.

 ```bash

 node server.js
```

