"use client";

import { useState } from "react";

type JoinFormProps = {
  conditions: string[];
};

type FormState = {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  bloodGroup: string;
  condition: string;
  batchType: string;
  goal: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  countryCode: "+91",
  phone: "",
  email: "",
  bloodGroup: "",
  condition: "",
  batchType: "",
  goal: "",
  notes: ""
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const batchTypes = ["Condition-specific batch", "Common wellness batch", "Merged support batch"];
const goals = [
  "Balance hormones",
  "Reduce stress",
  "Sleep better",
  "Improve flexibility",
  "Support pregnancy wellness",
  "Build a daily routine"
];

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA/Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" }
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function validateField(form: FormState, field: keyof FormState): string {
  const cleanName = form.name.trim().replace(/\s+/g, " ");
  const cleanEmail = form.email.trim().toLowerCase();
  const digits = normalizeDigits(form.phone);

  if (field === "name") {
    if (!cleanName) return "Name is required.";
    if (cleanName.length < 2 || cleanName.length > 80) return "Enter a valid full name (2-80 characters).";
    return "";
  }

  if (field === "countryCode") {
    if (!form.countryCode) return "Please select a country code.";
    if (!/^\+\d{1,4}$/.test(form.countryCode)) return "Please select a valid country code.";
    return "";
  }

  if (field === "phone") {
    if (!digits) return "Mobile number is required.";
    if (form.countryCode === "+91" && !/^[6-9]\d{9}$/.test(digits)) return "Enter a valid Indian mobile number.";
    if (form.countryCode !== "+91" && !/^\d{6,14}$/.test(digits)) return "Enter a valid mobile number.";
    return "";
  }

  if (field === "email") {
    if (!cleanEmail) return "Email is required.";
    if (!emailRegex.test(cleanEmail)) return "Enter a valid email address.";
    return "";
  }

  if (field === "bloodGroup" && !form.bloodGroup) return "Please select your blood group.";
  if (field === "condition" && !form.condition) return "Please select your health condition.";
  if (field === "batchType" && !form.batchType) return "Please select your preferred batch type.";
  if (field === "goal" && !form.goal) return "Please select your main goal.";
  if (field === "notes" && form.notes.length > 800) return "Notes should be within 800 characters.";

  return "";
}

function validateForm(form: FormState): FormErrors {
  const fields: (keyof FormState)[] = ["name", "countryCode", "phone", "email", "bloodGroup", "condition", "batchType", "goal", "notes"];
  const errors: FormErrors = {};

  for (const field of fields) {
    const error = validateField(form, field);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

export function JoinForm({ conditions }: JoinFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validateField(next, field) }));
      }
      if (field === "countryCode" && touched.phone) {
        setErrors((prev) => ({ ...prev, phone: validateField(next, "phone") }));
      }
      return next;
    });
  }

  function handleBlur(field: keyof FormState) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateField(form, field) }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched({
        name: true,
        countryCode: true,
        phone: true,
        email: true,
        bloodGroup: true,
        condition: true,
        batchType: true,
        goal: true,
        notes: true
      });
      setStatus("error");
      setMessage("Please fix the highlighted fields and submit again.");
      return;
    }

    const cleanName = form.name.trim().replace(/\s+/g, " ");
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPhone = normalizeDigits(form.phone);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone
        })
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong while saving your details.");
      }

      setStatus("success");
      setMessage("You are in. We saved your details and can now place you into the right batch.");
      setForm(initialState);
      setErrors({});
      setTouched({});
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save your details right now.");
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <label htmlFor="name">
        Your name
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          onBlur={() => handleBlur("name")}
          minLength={2}
          maxLength={80}
          aria-invalid={Boolean(errors.name)}
          required
        />
        {errors.name ? <span className="field-error">{errors.name}</span> : null}
      </label>

      <div className="phone-field">
        <label htmlFor="country-code">
          Country code
          <select
            id="country-code"
            value={form.countryCode}
            onChange={(event) => updateField("countryCode", event.target.value)}
            onBlur={() => handleBlur("countryCode")}
            aria-invalid={Boolean(errors.countryCode)}
            required
          >
            {countryCodes.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.countryCode ? <span className="field-error">{errors.countryCode}</span> : null}
        </label>

        <label htmlFor="phone">
          Mobile number
          <input
            id="phone"
            type="tel"
            placeholder="Enter mobile number"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            onBlur={() => handleBlur("phone")}
            inputMode="tel"
            maxLength={15}
            aria-invalid={Boolean(errors.phone)}
            required
          />
          {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
        </label>
      </div>

      <label htmlFor="email">
        Email address
        <input
          id="email"
          type="email"
          placeholder="dhyanvedaglobal@gmail.com"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          onBlur={() => handleBlur("email")}
          maxLength={120}
          aria-invalid={Boolean(errors.email)}
          required
        />
        {errors.email ? <span className="field-error">{errors.email}</span> : null}
      </label>

      <label htmlFor="blood-group">
        Blood group
        <select
          id="blood-group"
          value={form.bloodGroup}
          onChange={(event) => updateField("bloodGroup", event.target.value)}
          onBlur={() => handleBlur("bloodGroup")}
          aria-invalid={Boolean(errors.bloodGroup)}
          required
        >
          <option value="" disabled>
            Select blood group
          </option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        {errors.bloodGroup ? <span className="field-error">{errors.bloodGroup}</span> : null}
      </label>

      <label htmlFor="condition">
        Health condition
        <select
          id="condition"
          value={form.condition}
          onChange={(event) => updateField("condition", event.target.value)}
          onBlur={() => handleBlur("condition")}
          aria-invalid={Boolean(errors.condition)}
          required
        >
          <option value="" disabled>
            Select health condition
          </option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
        {errors.condition ? <span className="field-error">{errors.condition}</span> : null}
      </label>

      <label htmlFor="batch-type">
        Preferred batch type
        <select
          id="batch-type"
          value={form.batchType}
          onChange={(event) => updateField("batchType", event.target.value)}
          onBlur={() => handleBlur("batchType")}
          aria-invalid={Boolean(errors.batchType)}
          required
        >
          <option value="" disabled>
            Select batch type
          </option>
          {batchTypes.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
        {errors.batchType ? <span className="field-error">{errors.batchType}</span> : null}
      </label>

      <label htmlFor="goal">
        Your main goal
        <select
          id="goal"
          value={form.goal}
          onChange={(event) => updateField("goal", event.target.value)}
          onBlur={() => handleBlur("goal")}
          aria-invalid={Boolean(errors.goal)}
          required
        >
          <option value="" disabled>
            Select your goal
          </option>
          {goals.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
        {errors.goal ? <span className="field-error">{errors.goal}</span> : null}
      </label>

      <label htmlFor="notes">
        Tell us anything important
        <textarea
          id="notes"
          rows={4}
          placeholder="Share your symptoms, schedule preference, or anything you want us to know."
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          onBlur={() => handleBlur("notes")}
          maxLength={800}
          aria-invalid={Boolean(errors.notes)}
        />
        {errors.notes ? <span className="field-error">{errors.notes}</span> : null}
      </label>

      <button className="button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving your details..." : "Start My Wellness Journey Today"}
      </button>

      <p className="microcopy">
        We use your blood group, condition, and goal to guide batch placement and your first diet chart direction.
      </p>

      {message ? <p className={`form-status form-status-${status}`}>{message}</p> : null}
    </form>
  );
}
