import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "The Anchor Program",
  description:
    "AfricaZK's Solana program — instructions, accounts, PDAs, and on-chain validation rules.",
};

const PROGRAM_CODE = `use anchor_lang::prelude::*;

declare_id!("AfricaZK1111111111111111111111111111111111");

#[program]
pub mod africazk {
    use super::*;

    pub fn submit_proof(
        ctx: Context<SubmitProof>,
        proof_bytes: Vec<u8>,
        public_signals: [u8; 64], // valid (32) + nullifier (32)
        ax: [u8; 32],
        ay: [u8; 32],
    ) -> Result<()> {
        require!(public_signals[..32] == ONE_LE, ErrorCode::InvalidProof);
        require!(ax == AFRICAZK_AX, ErrorCode::WrongIssuer);
        require!(ay == AFRICAZK_AY, ErrorCode::WrongIssuer);

        // light-protocol verifier hook lives here in a future release
        verify_groth16(&proof_bytes, &public_signals, &ax, &ay)?;

        let attestation = &mut ctx.accounts.attestation;
        attestation.verified = true;
        attestation.timestamp = Clock::get()?.unix_timestamp;
        attestation.protocol = *b"AfricaZK-v1\\0\\0\\0\\0\\0";
        attestation.revoked = false;

        Ok(())
    }
}`;

const ACCOUNTS_CODE = `#[derive(Accounts)]
#[instruction(proof_bytes: Vec<u8>, public_signals: [u8; 64])]
pub struct SubmitProof<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + NullifierRecord::SIZE,
        seeds = [b"africazk-nullifier", &public_signals[32..]],
        bump
    )]
    pub nullifier_record: Account<'info, NullifierRecord>,

    #[account(
        init,
        payer = user,
        space = 8 + AttestationRecord::SIZE,
        seeds = [b"africazk-attestation", user.key().as_ref()],
        bump
    )]
    pub attestation: Account<'info, AttestationRecord>,

    pub system_program: Program<'info, System>,
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="The Anchor Program"
      href="/docs/core-concepts/anchor-program"
      intro={
        <>
          The AfricaZK program lives on Solana, written with the Anchor
          framework. It exposes one instruction (
          <span className="azk-inline-code">submit_proof</span>) and manages
          two PDAs (NullifierRecord and AttestationRecord). It enforces
          everything the off-chain pipeline can&apos;t.
        </>
      }
    >
      <h2 id="instruction">submit_proof instruction</h2>
      <CodeBlock code={PROGRAM_CODE} lang="ts" filename="programs/africazk/src/lib.rs" />

      <h2 id="accounts">Accounts</h2>
      <CodeBlock code={ACCOUNTS_CODE} lang="ts" filename="programs/africazk/src/accounts.rs" />
      <p>
        Both PDAs are <span className="azk-inline-code">init</span> accounts
        — they fail if they already exist. That fail-on-init is the entire
        duplicate-prevention story for nullifiers, and the
        attestation-uniqueness story per wallet.
      </p>

      <h2 id="errors">Error codes</h2>
      <SimpleTable
        headers={["Code", "Cause"]}
        rows={[
          ["InvalidProof", "valid signal is not 1, or Groth16 verification fails"],
          ["WrongIssuer", "Ax/Ay do not match the program-baked AfricaZK public key"],
          [
            "DuplicateNullifier",
            "NullifierRecord PDA already exists — this identity has been used",
          ],
          [
            "DuplicateAttestation",
            "AttestationRecord PDA already exists — this wallet already verified",
          ],
        ]}
      />

      <h2 id="upgrade-path">Upgrade path</h2>
      <p>
        Current builds inline a stub Groth16 verifier. The architecture is
        designed to slot in Light Protocol&apos;s on-chain Groth16 verifier
        as a drop-in replacement of{" "}
        <span className="azk-inline-code">verify_groth16</span> — the
        instruction signature and PDA layout stay identical, so existing
        dApps and SDK callers don&apos;t need to change.
      </p>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/nullifier-record">NullifierRecord</a>
        </li>
        <li>
          <a href="/docs/core-concepts/attestation-record">AttestationRecord</a>
        </li>
        <li>
          <a href="/docs/reference/pda-seeds">PDA seeds reference</a>
        </li>
      </ul>
    </DocPage>
  );
}
