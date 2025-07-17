import Char "mo:base/Char";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

module {
    public func toHex(bytes : [Nat8]) : Text {
        Array.foldLeft<Nat8, Text>(bytes, "", func(acc, byte) {
            acc # Nat8.toText(byte / 16) # Nat8.toText(byte % 16)
        });
    };

    public func fromHex(hex : Text) : Result.Result<[Nat8], Text> {
        let chars = Text.toArray(hex);
        if (chars.size() % 2 != 0) {
            return #err("Hex string must have even length");
        };
        
        var bytes : [var Nat8] = Array.init<Nat8>(chars.size() / 2, 0);
        var i = 0;
        
        while (i < chars.size()) {
            let high = charToNat8(chars[i]);
            let low = charToNat8(chars[i + 1]);
            
            switch (high, low) {
                case (?h, ?l) {
                    bytes[i / 2] := h * 16 + l;
                };
                case _ {
                    return #err("Invalid hex character");
                };
            };
            i += 2;
        };
        
        #ok(Array.freeze(bytes));
    };

    private func charToNat8(char : Char) : ?Nat8 {
        let code = Char.toNat32(char);
        if (code >= 48 and code <= 57) {
            // 0-9
            ?(Nat8.fromNat(Nat32.toNat(code - 48)));
        } else if (code >= 65 and code <= 70) {
            // A-F
            ?(Nat8.fromNat(Nat32.toNat(code - 55)));
        } else if (code >= 97 and code <= 102) {
            // a-f
            ?(Nat8.fromNat(Nat32.toNat(code - 87)));
        } else {
            null;
        };
    };
}