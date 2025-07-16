
# Instrukcja instalacji systemu tabletu organizacji

## Wymagania
- ESX Framework
- ox_mysql
- ox_lib
- ox_inventory (opcjonalnie)

## Instalacja

### 1. Baza danych
Wykonaj plik `tablet_database_final.sql` w swojej bazie danych MySQL:
```sql
-- Skopiuj i wykonaj cały kod z pliku tablet_database_final.sql
```

### 2. Pliki zasobów
1. Skopiuj folder `org-tablet` do swojego folderu `resources`
2. Skopiuj folder `org-system` do swojego folderu `resources`

### 3. Konfiguracja server.cfg
Dodaj do swojego `server.cfg`:
```
ensure ox_lib
ensure ox_mysql
ensure org-system
ensure org-tablet
```

### 4. Konfiguracja (opcjonalnie)
Edytuj `config.lua` aby dostosować:
- Ceny aplikacji
- Uprawnienia organizacji
- Stopnie organizacji
- Kategorie transakcji

### 5. Pierwszy start
1. Uruchom serwer
2. Utwórz organizację przez MySQL lub dodaj komendę w serwerze
3. Dodaj gracza do organizacji

### Przykład tworzenia organizacji:
```sql
INSERT INTO org_organizations (name, label, balance, crypto_balance) VALUES ('ballas', 'Ballas Gang', 50000, 25.0);
INSERT INTO org_members (identifier, organization, org_grade) VALUES ('char1:license_identifier', 'ballas', 5);
```

## Komendy

### Dla graczy:
- `/tablet` - Otwórz tablet organizacji (tylko dla członków organizacji)

### Dla adminów:
- `/generatevehicles` - Generuj przykładowe pojazdy do trackingu

## Funkcjonalności

### Podstawowe aplikacje:
- **Finanse** - Zarządzanie budżetem organizacji
- **Członkowie** - Zarządzanie członkami i zaproszeniami
- **Transakcje** - Historia finansów organizacji
- **Zlecenia** - System misji i zadań
- **Notatki** - Notatki organizacji
- **Ustawienia** - Rozbudowa organizacji

### Dodatowe aplikacje (do kupienia):
- **Kryptowaluty** - Handel kryptowalutami
- **Tracker** - Śledzenie pojazdów
- **Napady** - System planowania napadów

## Uprawnienia
System uprawnień pozwala na szczegółowe zarządzanie tym, co może robić każdy medlem:

### Stopnie organizacji:
- 0: Rekrut
- 1: Członek
- 2: Starszy Członek
- 3: Porucznik
- 4: Zastępca
- 5: Szef (wszystkie uprawnienia)

### Dostępne uprawnienia:
- `manage_finances` - Zarządzanie finansami
- `manage_members` - Zarządzanie członkami
- `manage_crypto` - Zarządzanie kryptowalutami
- `view_tracker` - Dostęp do trackera
- `manage_jobs` - Zarządzanie zleceniami
- `manage_notes` - Zarządzanie notatkami
- `purchase_apps` - Zakup aplikacji
- `stash_access` - Dostęp do schowka
- `garage_access` - Dostęp do garażu

## Rozwiązywanie problemów

### Tablet się nie otwiera:
1. Sprawdź czy gracz należy do organizacji
2. Sprawdź logi serwera pod kątem błędów
3. Upewnij się, że baza danych jest poprawnie skonfigurowana

### Brak danych w tablecie:
1. Sprawdź połączenie z bazą danych
2. Sprawdź czy organizacja istnieje w bazie
3. Sprawdź logi błędów MySQL

### Błędy aplikacji:
1. Sprawdź czy aplikacja została zakupiona
2. Sprawdź uprawnienia gracza
3. Sprawdź logi klienta i serwera

## Wsparcie
W przypadku problemów sprawdź logi serwera i klienta. Większość błędów jest logowana z prefiksem `[ORG-TABLET]` lub `[ORG-SYSTEM]`.
