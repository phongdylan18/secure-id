import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";

actor SecureID {
    // Type definitions
    public type Password = {
        id: Nat;
        owner: Principal;
        name: Text;
        username: Text;
        password: Text;
        website: Text;
        notes: Text;
        created: Int;
        updated: Int;
    };

    public type TOTP = {
        id: Nat;
        owner: Principal;
        name: Text;
        issuer: Text;
        secret: Text;
        algorithm: Text;
        digits: Nat;
        period: Nat;
        created: Int;
        updated: Int;
    };

    public type SecureNote = {
        id: Nat;
        owner: Principal;
        title: Text;
        content: Text;
        created: Int;
        updated: Int;
    };

    // Stable storage for upgrades
    private stable var passwordEntries : [(Nat, Password)] = [];
    private stable var totpEntries : [(Nat, TOTP)] = [];
    private stable var noteEntries : [(Nat, SecureNote)] = [];
    private stable var userPasswordMappings : [(Principal, [Nat])] = [];
    private stable var userTOTPMappings : [(Principal, [Nat])] = [];
    private stable var userNoteMappings : [(Principal, [Nat])] = [];
    private stable var nextPasswordId : Nat = 0;
    private stable var nextTOTPId : Nat = 0;
    private stable var nextNoteId : Nat = 0;

    // Runtime storage
    private var passwords = HashMap.HashMap<Nat, Password>(0, Nat.equal, Hash.hash);
    private var totps = HashMap.HashMap<Nat, TOTP>(0, Nat.equal, Hash.hash);
    private var notes = HashMap.HashMap<Nat, SecureNote>(0, Nat.equal, Hash.hash);
    private var userPasswords = HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);
    private var userTOTPs = HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);
    private var userNotes = HashMap.HashMap<Principal, [Nat]>(0, Principal.equal, Principal.hash);

    // Initialize from stable storage
    system func preupgrade() {
        passwordEntries := Iter.toArray(passwords.entries());
        totpEntries := Iter.toArray(totps.entries());
        noteEntries := Iter.toArray(notes.entries());
        userPasswordMappings := Iter.toArray(userPasswords.entries());
        userTOTPMappings := Iter.toArray(userTOTPs.entries());
        userNoteMappings := Iter.toArray(userNotes.entries());
    };

    system func postupgrade() {
        passwords := HashMap.fromIter<Nat, Password>(passwordEntries.vals(), passwordEntries.size(), Nat.equal, Hash.hash);
        totps := HashMap.fromIter<Nat, TOTP>(totpEntries.vals(), totpEntries.size(), Nat.equal, Hash.hash);
        notes := HashMap.fromIter<Nat, SecureNote>(noteEntries.vals(), noteEntries.size(), Nat.equal, Hash.hash);
        userPasswords := HashMap.fromIter<Principal, [Nat]>(userPasswordMappings.vals(), userPasswordMappings.size(), Principal.equal, Principal.hash);
        userTOTPs := HashMap.fromIter<Principal, [Nat]>(userTOTPMappings.vals(), userTOTPMappings.size(), Principal.equal, Principal.hash);
        userNotes := HashMap.fromIter<Principal, [Nat]>(userNoteMappings.vals(), userNoteMappings.size(), Principal.equal, Principal.hash);
    };

    // Helper functions
    private func addUserPassword(user: Principal, id: Nat) {
        let current = Option.get(userPasswords.get(user), []);
        let updated = Array.append(current, [id]);
        userPasswords.put(user, updated);
    };

    private func addUserTOTP(user: Principal, id: Nat) {
        let current = Option.get(userTOTPs.get(user), []);
        let updated = Array.append(current, [id]);
        userTOTPs.put(user, updated);
    };

    private func addUserNote(user: Principal, id: Nat) {
        let current = Option.get(userNotes.get(user), []);
        let updated = Array.append(current, [id]);
        userNotes.put(user, updated);
    };

    private func removeUserPassword(user: Principal, id: Nat) {
        let current = Option.get(userPasswords.get(user), []);
        let updated = Array.filter<Nat>(current, func(x) { x != id });
        userPasswords.put(user, updated);
    };

    private func removeUserTOTP(user: Principal, id: Nat) {
        let current = Option.get(userTOTPs.get(user), []);
        let updated = Array.filter<Nat>(current, func(x) { x != id });
        userTOTPs.put(user, updated);
    };

    private func removeUserNote(user: Principal, id: Nat) {
        let current = Option.get(userNotes.get(user), []);
        let updated = Array.filter<Nat>(current, func(x) { x != id });
        userNotes.put(user, updated);
    };

    // Password Management
    public shared(msg) func createPassword(
        name: Text,
        username: Text,
        password: Text,
        website: Text,
        notes: Text
    ) : async Result.Result<Nat, Text> {
        let caller = msg.caller;
        let id = nextPasswordId;
        nextPasswordId += 1;
        
        let newPassword: Password = {
            id = id;
            owner = caller;
            name = name;
            username = username;
            password = password;
            website = website;
            notes = notes;
            created = Time.now();
            updated = Time.now();
        };
        
        passwords.put(id, newPassword);
        addUserPassword(caller, id);
        
        #ok(id);
    };

    public shared(msg) func getPasswords() : async [Password] {
        let caller = msg.caller;
        let userIds = Option.get(userPasswords.get(caller), []);
        
        Array.mapFilter<Nat, Password>(userIds, func(id) {
            passwords.get(id);
        });
    };

    public shared(msg) func updatePassword(
        id: Nat,
        name: Text,
        username: Text,
        password: Text,
        website: Text,
        notes: Text
    ) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (passwords.get(id)) {
            case null { #err("Password not found") };
            case (?existing) {
                if (existing.owner != caller) {
                    return #err("Unauthorized");
                };
                
                let updated: Password = {
                    id = id;
                    owner = caller;
                    name = name;
                    username = username;
                    password = password;
                    website = website;
                    notes = notes;
                    created = existing.created;
                    updated = Time.now();
                };
                
                passwords.put(id, updated);
                #ok();
            };
        };
    };

    public shared(msg) func deletePassword(id: Nat) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (passwords.get(id)) {
            case null { #err("Password not found") };
            case (?existing) {
                if (existing.owner != caller) {
                    return #err("Unauthorized");
                };
                
                passwords.delete(id);
                removeUserPassword(caller, id);
                #ok();
            };
        };
    };

    // TOTP Management
    public shared(msg) func createTOTP(
        name: Text,
        issuer: Text,
        secret: Text,
        algorithm: Text,
        digits: Nat,
        period: Nat
    ) : async Result.Result<Nat, Text> {
        let caller = msg.caller;
        let id = nextTOTPId;
        nextTOTPId += 1;
        
        let newTOTP: TOTP = {
            id = id;
            owner = caller;
            name = name;
            issuer = issuer;
            secret = secret;
            algorithm = algorithm;
            digits = digits;
            period = period;
            created = Time.now();
            updated = Time.now();
        };
        
        totps.put(id, newTOTP);
        addUserTOTP(caller, id);
        
        #ok(id);
    };

    public shared(msg) func getTOTPs() : async [TOTP] {
        let caller = msg.caller;
        let userIds = Option.get(userTOTPs.get(caller), []);
        
        Array.mapFilter<Nat, TOTP>(userIds, func(id) {
            totps.get(id);
        });
    };

    public shared(msg) func updateTOTP(
        id: Nat,
        name: Text,
        issuer: Text,
        secret: Text,
        algorithm: Text,
        digits: Nat,
        period: Nat
    ) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (totps.get(id)) {
            case null { #err("TOTP not found") };
            case (?existing) {
                if (existing.owner != caller) {
                    return #err("Unauthorized");
                };
                
                let updated: TOTP = {
                    id = id;
                    owner = caller;
                    name = name;
                    issuer = issuer;
                    secret = secret;
                    algorithm = algorithm;
                    digits = digits;
                    period = period;
                    created = existing.created;
                    updated = Time.now();
                };
                
                totps.put(id, updated);
                #ok();
            };
        };
    };

    public shared(msg) func deleteTOTP(id: Nat) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (totps.get(id)) {
            case null { #err("TOTP not found") };
            case (?existing) {
                if (existing.owner != caller) {
                    return #err("Unauthorized");
                };
                
                totps.delete(id);
                removeUserTOTP(caller, id);
                #ok();
            };
        };
    };

    // Secure Notes Management
    public shared(msg) func createNote(
        title: Text,
        content: Text
    ) : async Result.Result<Nat, Text> {
        let caller = msg.caller;
        let id = nextNoteId;
        nextNoteId += 1;
        
        let newNote: SecureNote = {
            id = id;
            owner = caller;
            title = title;
            content = content;
            created = Time.now();
            updated = Time.now();
        };
        
        notes.put(id, newNote);
        addUserNote(caller, id);
        
        #ok(id);
    };

    public shared(msg) func getNotes() : async [SecureNote] {
        let caller = msg.caller;
        let userIds = Option.get(userNotes.get(caller), []);
        
        Array.mapFilter<Nat, SecureNote>(userIds, func(id) {
            notes.get(id);
        });
    };

    public shared(msg) func updateNote(
        id: Nat,
        title: Text,
        content: Text
    ) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (notes.get(id)) {
            case null { #err("Note not found") };
            case (?existing) {
                if (existing.owner != caller) {
                    return #err("Unauthorized");
                };
                
                let updated: SecureNote = {
                    id = id;
                    owner = caller;
                    title = title;
                    content = content;
                    created = existing.created;
                    updated = Time.now();
                };
                
                notes.put(id, updated);
                #ok();
            };
        };
    };

    public shared(msg) func deleteNote(id: Nat) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (notes.get(id)) {
            case null { #err("Note not found") };
            case (?existing) {
                if (existing.owner != caller) {
                    return #err("Unauthorized");
                };
                
                notes.delete(id);
                removeUserNote(caller, id);
                #ok();
            };
        };
    };

    // System Information
    public query func canister_id() : async Principal {
        Principal.fromActor(SecureID);
    };

    public query func get_stats() : async {
        totalPasswords: Nat;
        totalTOTPs: Nat;
        totalNotes: Nat;
        totalUsers: Nat;
    } {
        {
            totalPasswords = passwords.size();
            totalTOTPs = totps.size();
            totalNotes = notes.size();
            totalUsers = userPasswords.size();
        };
    };
}