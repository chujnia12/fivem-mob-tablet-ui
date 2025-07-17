
# Kompletna instrukcja instalacji systemu tabletu organizacji

## Wymagania
- ESX Framework
- ox_mysql
- ox_lib  
- ox_inventory

## Struktura folderów
```
resources/
├── org-system/          # Podstawowy system organizacji
└── org-tablet/          # System tabletu z interfejsem
```

## Instalacja krok po kroku

### 1. Baza danych
Wykonaj plik `tablet_database_final.sql` w swojej bazie danych MySQL.

### 2. Pliki zasobów
Skopiuj oba foldery do swojego katalogu `resources/`:
- `org-system/` - podstawowy system organizacji
- `org-tablet/` - system tabletu z interfejsem web

### 3. Skompiluj interfejs web (jeśli potrzeba)
Jeśli modyfikowałeś pliki React, musisz skompilować interfejs:
```bash
npm run build
# Skopiuj zawartość dist/ do org-tablet/web/dist/
```

### 4. Konfiguracja server.cfg
Dodaj do swojego `server.cfg` w odpowiedniej kolejności:
```
ensure ox_lib
ensure ox_mysql
ensure org-system
ensure org-tablet
```

### 5. Tworzenie organizacji
Przykład SQL do utworzenia organizacji:
```sql
-- Dodaj organizację
INSERT INTO org_organizations (name, label, balance, crypto_balance) VALUES 
('ballas', 'Ballas Gang', 50000, 100.0);

-- Dodaj gracza do organizacji (zastąp identyfikator)
INSERT INTO org_members (identifier, organization, org_grade) VALUES 
('char1:steam:110000100000000', 'ballas', 5);
```

### 6. Pierwszy test
1. Uruchom serwer
2. Dołącz jako gracz dodany do organizacji
3. Użyj komendy `/tablet`

## Komendy

### Dla graczy:
- `/tablet` - Otwórz tablet organizacji (tylko członkowie)

### Dla adminów:
- `/generatevehicles` - Generuj przykładowe pojazdy do trackingu

## Konfiguracja

### org-system/shared/config.lua
- Lokalizacje organizacji (spawn, garaż, schowek)
- Stopnie i uprawnienia
- Pojazdy organizacji

### org-tablet/config.lua  
- Ceny aplikacji
- Ceny rozbudowy
- Uprawnienia systemowe

## Aplikacje tabletu

### Domyślne (zawsze dostępne):
- **Finanse** - Zarządzanie budżetem
- **Członkowie** - Zarządzanie personelem  
- **Transakcje** - Historia finansowa
- **Zlecenia** - System zadań (podstawowy)
- **Notatki** - Notatki organizacji
- **Ustawienia** - Rozbudowa organizacji
- **Statystyki** - Przegląd danych
- **Sklep** - Zakup aplikacji

### Dodatowe (do kupienia za kryptowaluty):
- **Kryptowaluty** (50 COIN) - Handel krypto
- **Tracker** (75 COIN) - Śledzenie pojazdów  
- **Napady** (100 COIN) - Planowanie napadów
- **Zlecenia Pro** (25 COIN) - Zaawansowane zlecenia

## Rozwiązywanie problemów

### Tablet się nie otwiera:
```
Sprawdź w konsoli serwera:
- Czy gracz należy do organizacji
- Czy baza danych jest połączona
- Czy nie ma błędów w logach
```

### Interfejs nie ładuje się:
```
Sprawdź:
- Czy pliki web/dist/ istnieją  
- Czy fxmanifest.lua wskazuje właściwe pliki
- Czy nie ma błędów JavaScript w konsoli F12
```

### Błędy bazy danych:
```
Sprawdź:
- Połączenie ox_mysql
- Czy tabele zostały utworzone
- Czy dane organizacji istnieją
```

## Struktura uprawnień

### Rangi organizacji (0-5):
- **0** - Rekrut (podstawowe funkcje)
- **1** - Członek (schowek, notatki)
- **2** - Starszy Członek (garaż, tracker)  
- **3** - Porucznik (zlecenia)
- **4** - Zastępca (finanse, krypto)
- **5** - Szef (wszystkie uprawnienia)

### Uprawnienia systemowe:
- `manage_finances` - Zarządzanie finansami
- `manage_members` - Zarządzanie członkami
- `manage_crypto` - Handel kryptowalutami
- `view_tracker` - Dostęp do trackera
- `manage_jobs` - Tworzenie zleceń
- `manage_notes` - Zarządzanie notatkami
- `purchase_apps` - Zakup aplikacji
- `stash_access` - Dostęp do schowka
- `garage_access` - Dostęp do garażu

## Wsparcie
W przypadku problemów sprawdź logi serwera. Wszystkie komunikaty systemu są oznaczone prefiksami:
- `[ORG-SYSTEM]` - system organizacji
- `[ORG-TABLET]` - system tabletu
- `[ORG-STASH-GARAGE]` - system schowków i garażu
