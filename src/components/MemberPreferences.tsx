"use client";

import { FormEvent, useState } from "react";

type Member = {
  fullName: string;
  email: string;
  city: string;
  tablePreference: string;
  dietary?: string;
};

type MemberPreferencesProps = {
  member: Member;
  onUpdate?: () => void;
};

type Preferences = {
  emailNotifications: boolean;
  smsReminders: boolean;
  marketingEmails: boolean;
  defaultTablePreference: string;
  dietaryNotes: string;
  favoriteFormats: string[];
};

export function MemberPreferences({ member, onUpdate }: MemberPreferencesProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [prefs, setPrefs] = useState<Preferences>({
    emailNotifications: true,
    smsReminders: false,
    marketingEmails: true,
    defaultTablePreference: member.tablePreference || "mixed",
    dietaryNotes: member.dietary || "",
    favoriteFormats: [],
  });

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/me/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          preferences: prefs,
        }),
      });

      if (!res.ok) throw new Error("Failed to save preferences");
      
      setMessage("✓ Preferences saved");
      setTimeout(() => setMessage(""), 3000);
      onUpdate?.();
    } catch (err) {
      setMessage("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-display text-xl font-semibold">⚙️ Preferences</h3>
        <span className="text-2xl text-steel">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-steel">Notifications</h4>
            <div className="mt-3 space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={prefs.emailNotifications}
                  onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                  className="mt-0.5 size-4 accent-[var(--signal)]"
                />
                <div>
                  <span className="font-medium">Email notifications</span>
                  <p className="text-xs text-steel">Booking confirmations, venue details, reminders</p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={prefs.smsReminders}
                  onChange={(e) => setPrefs({ ...prefs, smsReminders: e.target.checked })}
                  className="mt-0.5 size-4 accent-[var(--signal)]"
                />
                <div>
                  <span className="font-medium">SMS reminders</span>
                  <p className="text-xs text-steel">Day-of reminders via text message</p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={prefs.marketingEmails}
                  onChange={(e) => setPrefs({ ...prefs, marketingEmails: e.target.checked })}
                  className="mt-0.5 size-4 accent-[var(--signal)]"
                />
                <div>
                  <span className="font-medium">New hangout alerts</span>
                  <p className="text-xs text-steel">Get notified when new events are posted</p>
                </div>
              </label>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-steel">Default Preferences</h4>
            <div className="mt-3 space-y-4">
              <div>
                <label className="field-label" htmlFor="defaultTable">
                  Table preference
                </label>
                <select
                  id="defaultTable"
                  value={prefs.defaultTablePreference}
                  onChange={(e) => setPrefs({ ...prefs, defaultTablePreference: e.target.value })}
                  className="field cursor-pointer"
                >
                  <option value="mixed">Mixed</option>
                  <option value="women-only">Women-only</option>
                  <option value="men-only">Men-only</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="dietary">
                  Dietary notes
                </label>
                <textarea
                  id="dietary"
                  value={prefs.dietaryNotes}
                  onChange={(e) => setPrefs({ ...prefs, dietaryNotes: e.target.value })}
                  className="field min-h-20"
                  placeholder="Halal, vegetarian, allergies, etc."
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-steel">Favorite Formats</h4>
            <p className="mt-2 text-xs text-steel">We'll prioritize these in your recommendations</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["dinner", "drinks", "beach", "picnic", "games", "brunch"].map((format) => (
                <label
                  key={format}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    prefs.favoriteFormats.includes(format)
                      ? "bg-signal text-signal-ink"
                      : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={prefs.favoriteFormats.includes(format)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPrefs({ ...prefs, favoriteFormats: [...prefs.favoriteFormats, format] });
                      } else {
                        setPrefs({
                          ...prefs,
                          favoriteFormats: prefs.favoriteFormats.filter((f) => f !== format),
                        });
                      }
                    }}
                    className="sr-only"
                  />
                  {format.charAt(0).toUpperCase() + format.slice(1)}
                </label>
              ))}
            </div>
          </section>

          {message && (
            <p className={`text-sm ${message.startsWith("✓") ? "text-signal" : "text-clay"}`}>{message}</p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? "Saving…" : "Save preferences"}
          </button>
        </form>
      )}
    </div>
  );
}
