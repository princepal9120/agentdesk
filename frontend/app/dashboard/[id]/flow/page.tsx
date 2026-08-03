"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PhoneCall, Plus, Save } from "lucide-react";
import { api, type Contact, type FlowVersion } from "@/lib/api";

type DraftNode = { type: "message" | "question" | "end"; text: string };

const starterNodes: DraftNode[] = [
  { type: "message", text: "Hello, this is calling from our team." },
  { type: "question", text: "Are you available to speak with us today?" },
  { type: "end", text: "Thank you. Have a great day." },
];

export default function FlowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [flows, setFlows] = useState<FlowVersion[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("Customer call flow");
  const [nodes, setNodes] = useState<DraftNode[]>(starterNodes);
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFlow, setSelectedFlow] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api.flows.list(id), api.contacts.list(id)]).then(([f, c]) => {
      setFlows(f);
      setContacts(c);
      if (f[0]) setSelectedFlow(f[0].id);
    });
  }, [id]);

  function updateNode(index: number, patch: Partial<DraftNode>) {
    setNodes((current) => current.map((node, i) => (i === index ? { ...node, ...patch } : node)));
  }

  async function saveFlow() {
    setBusy(true);
    setMessage("");
    try {
      const saved = await api.flows.create(id, {
        name,
        nodes: nodes.map((node, index) => ({
          id: `node-${index + 1}`,
          type: node.type,
          text: node.text,
          ...(index < nodes.length - 1 ? { next: `node-${index + 2}` } : {}),
        })),
        start_node_id: "node-1",
      });
      setFlows((current) => [saved, ...current]);
      setSelectedFlow(saved.id);
      setMessage("Flow saved and activated.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function addContact() {
    if (!phone.trim()) return;
    setBusy(true);
    try {
      const contact = await api.contacts.create(id, { name: contactName || undefined, phone_number: phone });
      setContacts((current) => [contact, ...current]);
      setContactName("");
      setPhone("");
      setMessage("Contact added.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function startCall(contact: Contact) {
    if (!selectedFlow) {
      setMessage("Save a flow first.");
      return;
    }
    setBusy(true);
    try {
      const result = await api.calls.outbound({ business_id: id, phone_number: contact.phone_number, flow_version_id: selectedFlow });
      setMessage(`Call created: ${result.room_name}`);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={`/dashboard/${id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-theme-label">
        <ArrowLeft className="h-4 w-4" /> Back to workspace
      </Link>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-theme-btn-accent">Call-only MVP</p>
        <h1 className="mt-2 text-4xl font-semibold text-theme-fg">Create a customer call flow</h1>
        <p className="mt-3 max-w-2xl text-theme-label">Define what the agent says, add customers, and place calls from one workspace.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-theme-fg">Flow steps</p>
              <p className="mt-1 text-sm text-theme-label">The MVP runs these steps in order.</p>
            </div>
            <button className="btn-secondary" onClick={() => setNodes((current) => [...current, { type: "message", text: "" }])}>
              <Plus className="mr-2 inline h-4 w-4" /> Add step
            </button>
          </div>
          <input className="input mt-6" value={name} onChange={(event) => setName(event.target.value)} placeholder="Flow name" />
          <div className="mt-4 space-y-3">
            {nodes.map((node, index) => (
              <div key={index} className="surface-muted grid gap-3 p-4 sm:grid-cols-[150px_1fr]">
                <select className="input" value={node.type} onChange={(event) => updateNode(index, { type: event.target.value as DraftNode["type"] })}>
                  <option value="message">Say something</option>
                  <option value="question">Ask a question</option>
                  <option value="end">End call</option>
                </select>
                <input className="input" value={node.text} onChange={(event) => updateNode(index, { text: event.target.value })} placeholder="What should the agent say?" />
              </div>
            ))}
          </div>
          <button className="btn-primary mt-5" disabled={busy} onClick={saveFlow}>
            <Save className="mr-2 inline h-4 w-4" /> {busy ? "Saving..." : "Save and activate flow"}
          </button>
        </section>

        <section className="surface p-6">
          <p className="text-sm font-semibold text-theme-fg">Add a customer</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="input" value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Customer name" />
            <input className="input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+919876543210" />
          </div>
          <button className="btn-secondary mt-3" disabled={busy} onClick={addContact}>Add customer</button>

          <div className="mt-8 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-theme-fg">Customers</p>
            <select className="input max-w-[180px]" value={selectedFlow} onChange={(event) => setSelectedFlow(event.target.value)}>
              <option value="">Choose flow</option>
              {flows.map((flow) => <option key={flow.id} value={flow.id}>{flow.name} v{flow.version}</option>)}
            </select>
          </div>
          <div className="mt-3 space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="surface-muted flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-theme-fg">{contact.name || "Unnamed customer"}</p>
                  <p className="mt-1 font-mono text-xs text-theme-label">{contact.phone_number}</p>
                </div>
                <button className="btn-accent text-xs" disabled={busy || !selectedFlow} onClick={() => startCall(contact)}>
                  <PhoneCall className="mr-1 inline h-3.5 w-3.5" /> Call
                </button>
              </div>
            ))}
            {!contacts.length && <p className="py-8 text-center text-sm text-theme-label">Add a phone number to create your first call.</p>}
          </div>
          {message && <p className="mt-5 rounded-xl border border-theme-border-muted bg-theme-surface-muted px-4 py-3 text-sm text-theme-label">{message}</p>}
        </section>
      </div>
    </main>
  );
}

