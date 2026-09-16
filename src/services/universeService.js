import { supabase } from "../lib/supabaseClient";

export async function getMyUniverse() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("universe_members")
    .select(`
      role,
      universes (
        id,
        name,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================================
   CREATE UNIVERSE
========================================================= */
export async function createUniverse(
  name = "Our Universe"
) {
  const {
    data,
    error,
  } = await supabase.rpc(
    "create_universe",
    {
      universe_name:
        name?.trim() || "Our Universe",
    }
  );

  if (error) {
    console.error(
      "Failed to create universe:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================================================
   CREATE INVITE
========================================================= */

export async function createUniverseInvite() {
  const {
    data,
    error,
  } = await supabase.rpc(
    "create_universe_invite"
  );

  if (error) {
    console.error(
      "Failed to create universe invite:",
      error
    );

    throw error;
  }

  return data;
}


/* =========================================================
   JOIN WITH INVITE CODE
========================================================= */

export async function joinUniverseWithCode(code) {
  if (!code?.trim()) {
    throw new Error(
      "Please enter your invitation code."
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "join_universe_with_code",
    {
      invite_code: code.trim().toUpperCase(),
    }
  );

  if (error) {
    console.error(
      "Failed to join universe:",
      error
    );

    throw error;
  }

  return data;
}


/* =========================================================
   GET UNIVERSE MEMBERS
========================================================= */

export async function getUniverseMembers(
  universeId
) {
  if (!universeId) {
    throw new Error(
      "Universe ID is required."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("universe_members")
    .select(`
      universe_id,
      user_id,
      role,
      created_at
    `)
    .eq(
      "universe_id",
      universeId
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Failed to fetch universe members:",
      error
    );

    throw error;
  }

  return data || [];
}