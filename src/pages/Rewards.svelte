<script>
  import cosmos from '../services/cosmos'
  import { ButtonLink } from '../components'

  const getPrizes = async () => {
    const [score, prizes] = await Promise.all([
      cosmos.getPlayerScore(),
      cosmos.getPrizes(),
    ])

    return prizes
      .sort((a, b) => a.repNeeded - b.repNeeded)
      .map(prize => ({
        ...prize,
        pointsRemaining: Math.max(0, prize.repNeeded - score),
      }))
  }

  const prizesPromise = getPrizes()
</script>

<h1>Rewards</h1>
{#await prizesPromise}
  <p>Fetching rewards&hellip;</p>
{:then prizes}
  <ul>
    {#each prizes as prize}
      <li>
        <span class="image-clip">
          <img src={prize.imageUrl} alt={prize.prizeText} />
        </span>
        <progress
          max={prize.repNeeded}
          value={prize.repNeeded - prize.pointsRemaining} />
        <span class="message">
          {#if prize.pointsRemaining}
            You are {prize.pointsRemaining} points away from a {prize.prizeText}
          {:else}
            <span class="claim">
              <ButtonLink>Claim</ButtonLink>
            </span>
            You earned a {prize.prizeText}
          {/if}
        </span>
      </li>
    {/each}
  </ul>
{:catch error}
  <p>There was an error fetching the rewards. {error.message}</p>
{/await}

<style>
  li {
    margin: 1em 0 2em;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12),
      0px 0px 2px rgba(0, 0, 0, 0.14);
    border-radius: 2px;
  }
  .image-clip {
    max-height: 170px;
    overflow: hidden;
    display: block;
  }
  img {
    width: 100%;
    background-color: var(--avatar-bg);
  }
  progress {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 4px;
    margin-top: 6px;
  }
  progress::-webkit-progress-bar {
    background-color: var(--gray);
  }
  progress::-webkit-progress-value {
    background-color: var(--blue);
  }
  .message {
    display: block;
    padding: 0.8em;
    font-size: 16px;
    overflow: auto;
  }
  .message :global(button) {
    float: right;
    line-height: inherit;
    margin: -1em 0;
  }
</style>