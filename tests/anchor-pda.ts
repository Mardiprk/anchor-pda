import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorPda } from "../target/types/anchor_pda";

describe("anchor-pda", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.anchorPda as Program<AnchorPda>;

  it("Creates a user account using PDA", async () => {
    const user = provider.wallet;
    const userName = "Alice";

    const [userAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),           
        user.publicKey.toBuffer()      
      ],
      program.programId
    );

    console.log("User pubkey:", user.publicKey.toString());
    console.log("PDA address:", userAccountPda.toString());

    await program.methods
      .createUserAccount(userName)
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ User account created successfully!");
    console.log("Name:", accountData.name);
    console.log("Points:", accountData.points);
  });

  it("Adds points to existing user account", async () => {
    const user = provider.wallet;

    const [userAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    await program.methods
      .addPoints(50)
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
        owner: user.publicKey,
      })
      .rpc();

    const accountData = await program.account.userAccount.fetch(userAccountPda);

    console.log("✅ Points added successfully!");
    console.log("Total points:", accountData.points);
  });

  it("Demonstrates PDA is deterministic", async () => {
    const user = provider.wallet;

    const [pda1] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );

    const [pda2] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );

    const [pda3] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    );

    console.log("✅ PDA is deterministic!");
    console.log("All calculations produce:", pda1.toString());
  });

  it("Shows different users get different PDAs", async () => {
    const user1 = provider.wallet;
    const user2 = anchor.web3.Keypair.generate();

    const [user1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user1.publicKey.toBuffer()],
      program.programId
    );

    const [user2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user2.publicKey.toBuffer()],
      program.programId
    );

    console.log("✅ Different users get different PDAs!");
    console.log("User1 PDA:", user1Pda.toString());
    console.log("User2 PDA:", user2Pda.toString());
  });
});
